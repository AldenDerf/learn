import assert from 'node:assert/strict';

// Run against a production server: node scripts/verify-course-availability.mjs
// Optional first argument overrides the local base URL.
const baseUrl = process.argv[2] ?? 'http://localhost:3100';
const blockedRoutes = [
  '/sys-admin/lab-1',
  '/sys-admin/module-1-intro',
  '/sys-admin/module-2-linux-basics',
  '/sys-admin/module-3-users-permissions',
  '/sys-admin/module-4-networking-services',
];
const availableRoutes = [
  '/',
  '/sys-admin',
  '/sys-admin/module-2',
  ...[
    'local-networking',
    'lab-2-1',
    'dynamic-ip-addressing',
    'name-resolution',
  ].map(slug => `/sys-admin/module-2/${slug}`),
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
  assert.match(html, /href=["']\/sys-admin(?:[\/"'#?])/, `${route} must expose course navigation`);
  for (const oldRoute of blockedRoutes) {
    assert.ok(!html.includes(`href="${oldRoute}"`), `${route} links to removed lesson ${oldRoute}`);
  }
  if (route === '/') {
    assert.match(html, /ITM 402/, 'Homepage must expose the reopened course');
  }
  if (route.startsWith('/sys-admin')) {
    assert.match(html, /draft for instructor review/i, `${route} must identify draft material`);
    const sidebar = html.match(/<aside\b[\s\S]*?<\/aside>/)?.[0];
    assert.ok(sidebar, `${route} must retain the course sidebar`);
    for (const slug of ['local-networking', 'lab-2-1', 'dynamic-ip-addressing', 'name-resolution']) {
      assert.ok(sidebar.includes(`/sys-admin/module-2/${slug}`), `${route} sidebar omits ${slug}`);
    }
  }
  console.log(`PASS 200 and course navigation: ${route}`);
}
