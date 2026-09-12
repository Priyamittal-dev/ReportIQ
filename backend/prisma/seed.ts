import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({});

async function main() {
  console.log('Seeding database...');
  
  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'gargr0109@gmail.com' },
    update: {},
    create: {
      email: 'gargr0109@gmail.com',
      passwordHash: adminPasswordHash,
      agencyName: 'Admin Agency',
      plan: 'WHITE_LABEL',
    },
  });

  // Create demo client
  await prisma.client.upsert({
    where: { id: 'demo-client-1' },
    update: {},
    create: {
      id: 'demo-client-1',
      name: 'Bright Digital',
      email: 'hello@brightdigital.com',
      userId: adminUser.id,
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
