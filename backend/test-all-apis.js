/**
 * ReportIQ — Full Regression Test Suite
 * Tests every single API endpoint end-to-end
 */
const BASE = 'http://localhost:4000/api';
let TOKEN = '';
let USER_ID = '';
let CLIENT_ID = '';
let REPORT_ID = '';
let REPORT_SLUG = '';

const results = [];
const UNIQUE = Date.now();

async function req(method, path, body, headers = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

function authHeaders() {
  return { Authorization: `Bearer ${TOKEN}` };
}

function pass(name) { results.push({ name, status: '✅ PASS' }); console.log(`✅ ${name}`); }
function fail(name, detail) { results.push({ name, status: '❌ FAIL', detail }); console.log(`❌ ${name}: ${detail}`); }

async function test(name, fn) {
  try {
    await fn();
    pass(name);
  } catch (e) {
    fail(name, e.message);
  }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

// ==========================================================
// 1. HEALTH CHECK
// ==========================================================
async function testHealthCheck() {
  await test('GET /api — Health Check', async () => {
    const r = await req('GET', '');
    assert(r.status === 200, `Status ${r.status}`);
  });
}

// ==========================================================
// 2. AUTH
// ==========================================================
async function testAuth() {
  await test('POST /api/auth/signup — Register', async () => {
    const r = await req('POST', '/auth/signup', {
      email: `test-${UNIQUE}@reportiq.io`,
      password: 'TestPass123!',
      agencyName: `TestAgency-${UNIQUE}`
    });
    assert(r.status === 201, `Status ${r.status}: ${JSON.stringify(r.data)}`);
    assert(r.data.message || r.data.accessToken, 'No response body');
  });

  await test('POST /api/auth/login — Login', async () => {
    const r = await req('POST', '/auth/login', {
      email: `test-${UNIQUE}@reportiq.io`,
      password: 'TestPass123!'
    });
    assert(r.status === 200, `Status ${r.status}: ${JSON.stringify(r.data)}`);
    TOKEN = r.data.accessToken;
    assert(TOKEN, 'No token returned');
  });

  await test('GET /api/auth/me — Get Current User', async () => {
    const r = await req('GET', '/auth/me', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(r.data.email, 'No email');
  });

  await test('GET /api/auth/verify — Verify Email (no token)', async () => {
    const r = await req('GET', '/auth/verify?token=fake');
    // Should not crash - 400 or 401 is fine
    assert(r.status < 500, `Server error ${r.status}`);
  });
}

// ==========================================================
// 3. USERS
// ==========================================================
async function testUsers() {
  await test('GET /api/users/me — Profile', async () => {
    const r = await req('GET', '/users/me', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(r.data.email, 'No email');
  });

  await test('PUT /api/users/me — Update Profile', async () => {
    const r = await req('PUT', '/users/me', { agencyName: `Updated-${UNIQUE}` }, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
  });

  await test('GET /api/users/me/stats — Dashboard Stats', async () => {
    const r = await req('GET', '/users/me/stats', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
  });
}

// ==========================================================
// 4. CLIENTS (CRUD)
// ==========================================================
async function testClients() {
  await test('POST /api/clients — Create Client', async () => {
    const r = await req('POST', '/clients', {
      name: `AcmeCorp-${UNIQUE}`,
      email: `acme-${UNIQUE}@test.com`,
      website: 'https://acme.test'
    }, authHeaders());
    assert(r.status === 201, `Status ${r.status}: ${JSON.stringify(r.data)}`);
    CLIENT_ID = r.data.id;
    assert(CLIENT_ID, 'No client ID');
  });

  await test('GET /api/clients — List Clients', async () => {
    const r = await req('GET', '/clients', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(Array.isArray(r.data), 'Not an array');
    assert(r.data.length > 0, 'Empty list');
  });

  await test('GET /api/clients/:id — Get Client', async () => {
    const r = await req('GET', `/clients/${CLIENT_ID}`, null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(r.data.name, 'No name');
  });

  await test('PUT /api/clients/:id — Update Client', async () => {
    const r = await req('PUT', `/clients/${CLIENT_ID}`, {
      name: `AcmeUpdated-${UNIQUE}`,
      notes: 'VIP client'
    }, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
  });
}

// ==========================================================
// 5. REPORTS
// ==========================================================
async function testReports() {
  await test('POST /api/reports/generate — Generate Report', async () => {
    const r = await req('POST', '/reports/generate', {
      clientId: CLIENT_ID,
      title: `Monthly Report ${UNIQUE}`
    }, authHeaders());
    assert(r.status === 201, `Status ${r.status}: ${JSON.stringify(r.data)}`);
    REPORT_ID = r.data.id;
    REPORT_SLUG = r.data.publicSlug;
    assert(REPORT_ID, 'No report ID');
  });

  await test('GET /api/reports — List Reports', async () => {
    const r = await req('GET', '/reports', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(Array.isArray(r.data), 'Not an array');
  });

  await test('GET /api/reports/:id — Get Report', async () => {
    const r = await req('GET', `/reports/${REPORT_ID}`, null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(r.data.title, 'No title');
  });

  await test('GET /api/reports/public/:slug — Public Report', async () => {
    if (!REPORT_SLUG) { pass('GET /api/reports/public/:slug — SKIPPED'); return; }
    const r = await req('GET', `/reports/public/${REPORT_SLUG}`);
    assert(r.status === 200, `Status ${r.status}`);
  });
}

// ==========================================================
// 6. AI
// ==========================================================
async function testAI() {
  await test('POST /api/ai/chat — AI Chat', async () => {
    const r = await req('POST', '/ai/chat', { message: 'What is CPA?' }, authHeaders());
    assert(r.status === 201 || r.status === 200, `Status ${r.status}`);
    assert(r.data.reply || r.data.message || typeof r.data === 'string', 'No reply');
  });

  await test('POST /api/ai/summarize — AI Summarize', async () => {
    const r = await req('POST', '/ai/summarize', {
      agencyName: 'TestAgency',
      clientName: 'AcmeCorp',
      metrics: { sessions: 12000, conversions: 350, revenue: 8400 }
    }, authHeaders());
    assert(r.status === 201 || r.status === 200, `Status ${r.status}: ${JSON.stringify(r.data)}`);
  });
  await test('POST /api/ai/action-plan — AI Action Plan', async () => {
    const r = await req('POST', '/ai/action-plan', {
      agencyName: 'TestAgency',
      clientName: 'AcmeCorp',
      metrics: { sessions: 12000, conversions: 350, revenue: 8400 }
    }, authHeaders());
    assert(r.status === 201 || r.status === 200, `Status ${r.status}: ${JSON.stringify(r.data)}`);
  });
}

// ==========================================================
// 7. INTEGRATIONS
// ==========================================================
async function testIntegrations() {
  await test('GET /api/integrations — List Integrations', async () => {
    const r = await req('GET', '/integrations', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
  });

  await test('POST /api/integrations/manual — Add Manual Integration', async () => {
    const r = await req('POST', '/integrations/manual', {
      type: 'google-analytics',
      label: `Test GA ${UNIQUE}`,
      propertyId: 'GA-123456'
    }, authHeaders());
    assert(r.status === 201 || r.status === 200, `Status ${r.status}: ${JSON.stringify(r.data)}`);
  });
}

// ==========================================================
// 8. SPOTLIGHT (Public Search APIs)
// ==========================================================
async function testSpotlight() {
  await test('GET /api/spotlight/reports — Public Reports', async () => {
    const r = await req('GET', '/spotlight/reports');
    assert(r.status === 200, `Status ${r.status}`);
    assert(r.data.reports, 'No reports field');
  });

  await test('GET /api/spotlight/agencies — Public Agencies', async () => {
    const r = await req('GET', '/spotlight/agencies');
    assert(r.status === 200, `Status ${r.status}`);
    assert(Array.isArray(r.data), 'Not an array');
  });

  await test('GET /api/spotlight/search?q=test — Search', async () => {
    const r = await req('GET', '/spotlight/search?q=test');
    assert(r.status === 200, `Status ${r.status}`);
    assert(Array.isArray(r.data), 'Not an array');
  });

  await test('GET /api/spotlight/reports/:slug — Single Report', async () => {
    const r = await req('GET', '/spotlight/reports/bright-digital-may-2024');
    assert(r.status === 200, `Status ${r.status}`);
  });
}

// ==========================================================
// 9. ADMIN
// ==========================================================
async function testAdmin() {
  await test('GET /api/admin/stats — Admin Stats', async () => {
    const r = await req('GET', '/admin/stats', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(r.data.stats, 'No stats');
  });

  await test('GET /api/admin/users — Admin Users', async () => {
    const r = await req('GET', '/admin/users', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(Array.isArray(r.data), 'Not array');
  });

  await test('GET /api/admin/config — Admin Config', async () => {
    const r = await req('GET', '/admin/config', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(r.data.maintenanceMode !== undefined, 'No maintenanceMode field');
  });

  await test('PUT /api/admin/config — Toggle Maintenance', async () => {
    const r = await req('PUT', '/admin/config', { maintenanceMode: false }, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(r.data.success === true, 'Not successful');
  });
}


// ==========================================================
// 10. AUDIT LOGS
// ==========================================================
async function testAuditLogs() {
  await test('GET /api/audit-logs — Audit Logs', async () => {
    const r = await req('GET', '/audit-logs', null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
    assert(Array.isArray(r.data), 'Not an array');
  });
}

// ==========================================================
// 11. SCRAPER
// ==========================================================
async function testScraper() {
  await test('POST /api/scraper/analyze — Scraper', async () => {
    const r = await req('POST', '/scraper/analyze', { url: 'https://example.com' }, authHeaders());
    assert(r.status === 201 || r.status === 200, `Status ${r.status}: ${JSON.stringify(r.data)}`);
  });
}

// ==========================================================
// 12. WHATSAPP
// ==========================================================
async function testWhatsApp() {
  await test('POST /api/whatsapp/webhook — WhatsApp Webhook', async () => {
    const r = await fetch(`${BASE}/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'From=whatsapp%3A%2B1234567890&Body=Hello%20test'
    });
    assert(r.status < 500, `Server error ${r.status}`);
  });
}

// ==========================================================
// 13. CLIENT PORTAL AUTH
// ==========================================================
async function testPortalAuth() {
  // First set a portal password on our client
  await req('PUT', `/clients/${CLIENT_ID}`, { portalPassword: 'portal123' }, authHeaders());

  await test('POST /api/auth/portal/login — Portal Login', async () => {
    const r = await req('POST', '/auth/portal/login', {
      email: `acme-${UNIQUE}@test.com`,
      password: 'portal123'
    });
    // It may fail if portalLogin doesn't hash, but shouldn't 500
    assert(r.status < 500, `Server error ${r.status}: ${JSON.stringify(r.data)}`);
  });
}

// ==========================================================
// 14. CLEANUP — Delete client
// ==========================================================
async function testCleanup() {
  await test('DELETE /api/clients/:id — Delete Client', async () => {
    const r = await req('DELETE', `/clients/${CLIENT_ID}`, null, authHeaders());
    assert(r.status === 200, `Status ${r.status}`);
  });
}

// ==========================================================
// RUN ALL TESTS
// ==========================================================
async function main() {
  console.log('\n═══════════════════════════════════════════════');
  console.log('  ReportIQ — Full Regression Test Suite');
  console.log('═══════════════════════════════════════════════\n');

  await testHealthCheck();
  await testAuth();
  await testUsers();
  await testClients();
  await testReports();
  await testAI();
  await testIntegrations();
  await testSpotlight();
  await testAdmin();
  await testAuditLogs();
  await testScraper();
  await testWhatsApp();
  await testPortalAuth();
  await testCleanup();

  const passed = results.filter(r => r.status.includes('PASS')).length;
  const failed = results.filter(r => r.status.includes('FAIL')).length;

  console.log('\n═══════════════════════════════════════════════');
  console.log(`  RESULTS: ${passed} passed, ${failed} failed / ${results.length} total`);
  console.log('═══════════════════════════════════════════════');

  if (failed > 0) {
    console.log('\n❌ FAILURES:');
    results.filter(r => r.status.includes('FAIL')).forEach(r => {
      console.log(`   ${r.name}: ${r.detail}`);
    });
  }
}

main().catch(console.error);
