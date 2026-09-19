import assert from 'node:assert/strict';

// Run against a production server: node scripts/verify-course-availability.mjs
// Optional first argument overrides the local base URL.
const baseUrl = process.argv[2] ?? 'http://localhost:3100';
const moduleLessons = [
  ['local-networking', '2.1 Local Networking'],
  ['lab-2-1', 'Lab 2.1: Static IP'],
  ['dynamic-ip-addressing', '2.2 DHCP'],
  ['name-resolution', '2.3 DNS'],
];
const courseSequence = [
  '/sys-admin',
  '/sys-admin/module-2',
  ...moduleLessons.map(([slug]) => `/sys-admin/module-2/${slug}`),
];
const renderedPages = new Map();

// Check server-rendered navigation, not browser interaction or visual layout.
function linksIn(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attributes, body]) => ({
    href: attributes.match(/\bhref="([^"]*)"/)?.[1].replaceAll('&amp;', '&'),
    className: attributes.match(/\bclass="([^"]*)"/)?.[1] ?? '',
    text: body.replace(/<[^>]*>/g, '').replaceAll('&amp;', '&').trim(),
  }));
}
const blockedRoutes = [
  '/sys-admin/lab-1',
  '/sys-admin/module-1-intro',
  '/sys-admin/module-2-linux-basics',
  '/sys-admin/module-3-users-permissions',
  '/sys-admin/module-4-networking-services',
];
const availableRoutes = [
  '/',
  ...courseSequence,
  '/web-systems',
  '/web-systems/chapter-2',
  ...[
    'first-program',
    'http-requests-responses',
    'first-express-server',
    'request-response-lifecycle',
    'middleware-complete-server',
    'lab-2-1',
  ].map(slug => `/web-systems/chapter-2/${slug}`),
];

for (const route of blockedRoutes) {
  const response = await fetch(new URL(route, baseUrl), { redirect: 'manual' });
  assert.equal(response.status, 404, `${route} must be unavailable`);
  console.log(`PASS 404 ${route}`);
}

for (const route of availableRoutes) {
  const response = await fetch(new URL(route, baseUrl), { redirect: 'manual' });
  assert.equal(response.status, 200, `${route} must remain available`);
  const html = await response.text();
  renderedPages.set(route, html);
  assert.match(html, /href=["']\/sys-admin(?:[\/"'#?])/, `${route} must expose course navigation`);
  for (const oldRoute of blockedRoutes) {
    assert.ok(!html.includes(`href="${oldRoute}"`), `${route} links to removed lesson ${oldRoute}`);
  }
  if (route === '/') {
    assert.match(html, /ITM 402/, 'Homepage must expose the reopened course');
  }
  if (route.startsWith('/sys-admin')) {
    assert.match(html, /draft for instructor review/i, `${route} must identify draft material`);
    const sidebars = [...html.matchAll(/<aside\b[\s\S]*?<\/aside>/g)].map(match => match[0]);
    for (const kind of ['nextra-sidebar', 'nextra-mobile-nav']) {
      const sidebar = sidebars.find(aside => aside.includes(kind));
      assert.ok(sidebar, `${route} must render ${kind}`);
      const links = linksIn(sidebar).filter(link => link.href?.startsWith('/sys-admin'));
      assert.deepEqual(links.map(link => link.href), courseSequence, `${route}: ${kind} order or duplicate entry`);
      assert.deepEqual(links.map(link => link.text), [
        'System Admin Home', 'Module 2 Overview', ...moduleLessons.map(([, label]) => label),
      ], `${route}: ${kind} labels`);
      assert.match(sidebar, /Module 2: Networking &amp; Services/, `${route}: module group label`);
      const activeLinks = links.filter(link => link.className.includes('x:bg-primary-100'));
      assert.deepEqual(activeLinks.map(link => link.href), [route], `${route}: ${kind} active-page styling`);
    }
    const pagination = linksIn(html).filter(link => link.className.includes('x:max-w-[50%]'));
    const position = courseSequence.indexOf(route);
    const neighbors = [courseSequence[position - 1], courseSequence[position + 1]].filter(Boolean);
    assert.deepEqual(pagination.map(link => link.href), neighbors, `${route}: Previous/Next sequence`);
    assert.doesNotMatch(html, /github\.com\/xxoo3034\/learn/, `${route}: stale repository owner`);
    assert.match(html, /https:\/\/github\.com\/AldenDerf\/learn/, `${route}: repository link`);
  }
  console.log(`PASS 200 and course navigation: ${route}`);
}

// Follow every internal anchor from System Admin, including in-page step links.
const origin = new URL(baseUrl).origin;
const checkedTargets = new Set();
for (const route of courseSequence) {
  for (const { href } of linksIn(renderedPages.get(route))) {
    if (!href) continue;
    const url = new URL(href, new URL(route, baseUrl));
    if (url.origin !== origin) continue;
    const target = url.pathname + url.search;
    if (!renderedPages.has(target)) {
      const response = await fetch(new URL(target, baseUrl));
      assert.equal(response.status, 200, `${route} links to unavailable ${target}`);
      renderedPages.set(target, await response.text());
    }
    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(renderedPages.get(target).includes(`id="${id}"`), `${route} has a broken fragment ${href}`);
    }
    checkedTargets.add(target + url.hash);
  }
}
assert.ok(linksIn(renderedPages.get('/')).some(link => link.href === '/sys-admin'), 'Homepage course entry');
assert.ok(linksIn(renderedPages.get('/sys-admin')).some(link => link.href === '/sys-admin/module-2'), 'Module 2 entry');
console.log(`PASS sidebar labels/order/active styling, Previous/Next, and ${checkedTargets.size} internal route/fragment targets`);
