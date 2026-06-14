const http = require('http');

const API_URL = 'http://localhost:4000/api';

function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function log(pass, name, details = '') {
  const icon = pass ? '✅' : '❌';
  console.log(`${icon} ${name}${details ? ' — ' + details : ''}`);
  return pass;
}

async function runTests() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║    ReportIQ — Full API Regression Suite       ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  let token = null;
  let testEmail = `regression-${Date.now()}@test.com`;
  let passed = 0, failed = 0;

  // ==================== 1. Health Check ====================
  console.log('─── Health Check ───');
  try {
    const r = await request('', 'GET');
    log(r.status === 200, 'GET /api (health check)', `Status: ${r.status}`) ? passed++ : failed++;
  } catch(e) {
    log(false, 'GET /api (health check)', 'Server not reachable!'); failed++;
    console.log('\n⛔ Server is not running on port 4000. Please start the backend first.\n');
    return;
  }

  // ==================== 2. Auth Flow ====================
  console.log('\n─── Auth Flow ───');
  
  // Signup
  const signupRes = await request('/auth/signup', 'POST', {
    agencyName: 'Regression Test Agency',
    email: testEmail,
    password: 'TestPass123!'
  });
  log(signupRes.status === 201, 'POST /auth/signup', `Status: ${signupRes.status}`) ? passed++ : failed++;

  // Login
  const loginRes = await request('/auth/login', 'POST', { email: testEmail, password: 'TestPass123!' });
  const loginOk = loginRes.status === 200 && loginRes.data.accessToken;
  log(loginOk, 'POST /auth/login', `Status: ${loginRes.status}`) ? passed++ : failed++;
  token = loginRes.data?.accessToken;

  // Login with wrong password
  const badLoginRes = await request('/auth/login', 'POST', { email: testEmail, password: 'wrongpassword' });
  log(badLoginRes.status === 401, 'POST /auth/login (bad password)', `Status: ${badLoginRes.status}`) ? passed++ : failed++;

  // Auth Me
  const meRes = await request('/auth/me', 'GET', null, token);
  log(meRes.status === 200 && meRes.data.email === testEmail, 'GET /auth/me', `Email: ${meRes.data?.email}`) ? passed++ : failed++;

  // Auth Me without token
  const noAuthRes = await request('/auth/me', 'GET');
  log(noAuthRes.status === 401, 'GET /auth/me (no token)', `Status: ${noAuthRes.status}`) ? passed++ : failed++;

  // ==================== 3. Clients CRUD ====================
  console.log('\n─── Clients CRUD ───');

  // Create Client
  const createClientRes = await request('/clients', 'POST', {
    name: 'Regression Test Client',
    email: 'client@regression.test',
    website: 'https://regression.test',
    timezone: 'UTC',
    notes: 'Created by regression test'
  }, token);
  const clientCreated = createClientRes.status === 201;
  log(clientCreated, 'POST /clients (create)', `Status: ${createClientRes.status}`) ? passed++ : failed++;
  const clientId = createClientRes.data?.id;

  // List Clients
  const listClientsRes = await request('/clients', 'GET', null, token);
  const clientsOk = listClientsRes.status === 200 && Array.isArray(listClientsRes.data);
  log(clientsOk, 'GET /clients (list)', `Count: ${listClientsRes.data?.length}`) ? passed++ : failed++;

  // Get single client
  if (clientId) {
    const getClientRes = await request(`/clients/${clientId}`, 'GET', null, token);
    log(getClientRes.status === 200, 'GET /clients/:id (single)', `Status: ${getClientRes.status}`) ? passed++ : failed++;

    // Update client
    const updateRes = await request(`/clients/${clientId}`, 'PUT', { name: 'Updated Name' }, token);
    log(updateRes.status === 200, 'PUT /clients/:id (update)', `Status: ${updateRes.status}`) ? passed++ : failed++;

    // Delete client
    const deleteRes = await request(`/clients/${clientId}`, 'DELETE', null, token);
    log(deleteRes.status === 200, 'DELETE /clients/:id (delete)', `Status: ${deleteRes.status}`) ? passed++ : failed++;
  }

  // ==================== 4. Reports ====================
  console.log('\n─── Reports ───');

  const listReportsRes = await request('/reports', 'GET', null, token);
  log(listReportsRes.status === 200, 'GET /reports (list)', `Status: ${listReportsRes.status}`) ? passed++ : failed++;

  // Generate a report
  const genReportRes = await request('/reports/generate', 'POST', {
    clientName: 'Test Client',
    dateRange: 'This Month',
    sections: ['overview', 'traffic']
  }, token);
  log([200, 201].includes(genReportRes.status), 'POST /reports/generate', `Status: ${genReportRes.status}`) ? passed++ : failed++;

  // ==================== 5. AI Chat ====================
  console.log('\n─── AI Chat ───');

  const chatRes = await request('/ai/chat', 'POST', { message: 'Hello, how are you?' }, token);
  const chatOk = chatRes.status === 200 || chatRes.status === 201;
  log(chatOk, 'POST /ai/chat', `Status: ${chatRes.status}, Response length: ${typeof chatRes.data === 'string' ? chatRes.data.length : JSON.stringify(chatRes.data).length}`) ? passed++ : failed++;

  // AI Summarize
  const summarizeRes = await request('/ai/summarize', 'POST', {
    agencyName: 'Test Agency',
    clientName: 'Test Client',
    metrics: { sessions: 5000, conversions: 150, conversionRate: 3.0 }
  }, token);
  log([200, 201].includes(summarizeRes.status), 'POST /ai/summarize', `Status: ${summarizeRes.status}`) ? passed++ : failed++;

  // ==================== 6. Integrations ====================
  console.log('\n─── Integrations ───');

  const integrationsRes = await request('/integrations', 'GET', null, token);
  log(integrationsRes.status === 200, 'GET /integrations', `Status: ${integrationsRes.status}`) ? passed++ : failed++;

  const googleAuthRes = await request('/integrations/google-ads/auth', 'GET', null, token);
  log([200, 302].includes(googleAuthRes.status), 'GET /integrations/google-ads/auth', `Status: ${googleAuthRes.status}`) ? passed++ : failed++;

  const metaAuthRes = await request('/integrations/meta-ads/auth', 'GET', null, token);
  log([200, 302].includes(metaAuthRes.status), 'GET /integrations/meta-ads/auth', `Status: ${metaAuthRes.status}`) ? passed++ : failed++;

  // ==================== 7. Spotlight ====================
  console.log('\n─── Spotlight Search ───');

  const spotlightReportsRes = await request('/spotlight/reports');
  log(spotlightReportsRes.status === 200, 'GET /spotlight/reports', `Status: ${spotlightReportsRes.status}`) ? passed++ : failed++;

  const spotlightAgenciesRes = await request('/spotlight/agencies');
  log(spotlightAgenciesRes.status === 200, 'GET /spotlight/agencies', `Status: ${spotlightAgenciesRes.status}`) ? passed++ : failed++;

  const searchRes = await request('/spotlight/search?q=test');
  log(searchRes.status === 200, 'GET /spotlight/search?q=test', `Status: ${searchRes.status}`) ? passed++ : failed++;

  // ==================== 8. Admin ====================
  console.log('\n─── Admin ───');

  const adminRes = await request('/admin/stats', 'GET', null, token);
  log(adminRes.status === 200, 'GET /admin/stats', `Status: ${adminRes.status}`) ? passed++ : failed++;

  // ==================== 9. Audit Logs ====================
  console.log('\n─── Audit Logs ───');

  const auditRes = await request('/audit-logs', 'GET', null, token);
  log(auditRes.status === 200, 'GET /audit-logs', `Status: ${auditRes.status}`) ? passed++ : failed++;

  // ==================== 10. Scraper ====================
  console.log('\n─── Scraper ───');

  const scraperRes = await request('/scraper/analyze', 'POST', { url: 'https://example.com' }, token);
  log([200, 201].includes(scraperRes.status), 'POST /scraper/analyze', `Status: ${scraperRes.status}`) ? passed++ : failed++;

  // ==================== 11. Users ====================
  console.log('\n─── User Profile ───');

  const userMeRes = await request('/users/me', 'GET', null, token);
  log(userMeRes.status === 200, 'GET /users/me', `Status: ${userMeRes.status}`) ? passed++ : failed++;

  const userStatsRes = await request('/users/me/stats', 'GET', null, token);
  log(userStatsRes.status === 200, 'GET /users/me/stats', `Status: ${userStatsRes.status}`) ? passed++ : failed++;

  // ==================== RESULTS ====================
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log(`║  TOTAL: ${passed + failed}  |  ✅ PASS: ${passed}  |  ❌ FAIL: ${failed}       ║`);
  console.log('╚══════════════════════════════════════════════╝\n');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED — ReportIQ is ready for launch!\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed. See above for details.\n`);
  }
}

runTests().catch(e => console.error('Fatal error:', e));
