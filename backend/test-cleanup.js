/**
 * ReportIQ — Database Cleanup Script
 * Removes test data created during automated testing
 * Preserves demo user and original data
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  console.log('\n🧹 ReportIQ — Database Cleanup');
  console.log('═══════════════════════════════════════');

  // 1. Count current state
  const usersBefore = await prisma.user.count();
  const clientsBefore = await prisma.client.count();
  const reportsBefore = await prisma.report.count();
  const integsBefore = await prisma.integration.count();
  const auditsBefore = await prisma.auditLog.count();

  console.log(`\n📊 Before cleanup:`);
  console.log(`   Users: ${usersBefore}`);
  console.log(`   Clients: ${clientsBefore}`);
  console.log(`   Reports: ${reportsBefore}`);
  console.log(`   Integrations: ${integsBefore}`);
  console.log(`   Audit Logs: ${auditsBefore}`);

  // 2. Find and delete test users (created by test-all-apis.js)
  const testUsers = await prisma.user.findMany({
    where: {
      email: { contains: 'test-' }
    }
  });

  console.log(`\n🔍 Found ${testUsers.length} test user(s) to clean:`);
  for (const u of testUsers) {
    console.log(`   - ${u.email} (${u.agencyName})`);
    // Cascading delete will handle clients, reports, integrations
    await prisma.user.delete({ where: { id: u.id } });
  }

  // 3. Clean up orphaned audit logs from test users
  const deletedAudits = await prisma.auditLog.deleteMany({
    where: {
      userId: { in: testUsers.map(u => u.id) }
    }
  });
  console.log(`   Cleaned ${deletedAudits.count} audit log entries`);

  // 4. Count final state
  const usersAfter = await prisma.user.count();
  const clientsAfter = await prisma.client.count();
  const reportsAfter = await prisma.report.count();
  const integsAfter = await prisma.integration.count();
  const auditsAfter = await prisma.auditLog.count();

  console.log(`\n📊 After cleanup:`);
  console.log(`   Users: ${usersAfter}`);
  console.log(`   Clients: ${clientsAfter}`);
  console.log(`   Reports: ${reportsAfter}`);
  console.log(`   Integrations: ${integsAfter}`);
  console.log(`   Audit Logs: ${auditsAfter}`);

  console.log(`\n✅ Cleanup complete! Removed ${usersBefore - usersAfter} test user(s)`);
  console.log('═══════════════════════════════════════\n');

  await prisma.$disconnect();
}

cleanup().catch(e => {
  console.error('Cleanup error:', e.message);
  process.exit(1);
});
