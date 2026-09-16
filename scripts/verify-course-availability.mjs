import assert from 'node:assert/strict';

// Run against a production server: node scripts/verify-course-availability.mjs
// Optional first argument overrides the local base URL.
const baseUrl = process.argv[2] ?? 'http://localhost:3100';
const blockedRoutes = [
  '/sys-admin',
  '/sys-admin/lab-1',
  '/sys-admin/module-1-intro',
  '/sys-admin/module-2-linux-basics',
  '/sys-admin/module-3-users-permissions',
  '/sys-admin/module-4-networking-services',
];
const availableRoutes = [
  '/',
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
  assert.doesNotMatch(html, /href=["']\/sys-admin(?:[\/"'#?])/, `${route} exposes a course link`);
  if (route === '/') {
    assert.doesNotMatch(html, /System Administration|ITM 402/, 'Homepage exposes the hidden course');
  }
  console.log(`PASS 200, no System Administration links: ${route}`);
}
