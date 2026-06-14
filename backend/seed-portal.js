const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get first user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found');
    return;
  }

  // Check if client exists
  let client = await prisma.client.findFirst({ where: { email: 'client@portal.com' } });
  
  if (!client) {
    client = await prisma.client.create({
      data: {
        name: 'Portal Test Client',
        email: 'client@portal.com',
        portalPassword: 'password123',
        userId: user.id,
      }
    });
    console.log('Created test client:', client.email);
  } else {
    client = await prisma.client.update({
      where: { id: client.id },
      data: { portalPassword: 'password123' }
    });
    console.log('Updated test client password:', client.email);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
