import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
// prisma/seed.ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await seedUsers();
}

async function seedUsers() {
  // upsert = create if not exists, update if exists → safe to run multiple times
  const zakariae = await prisma.user.upsert({
    where: { email: 'zakariae@gmail.com' },
    update: {},
    create: {
      email: 'zakariae@gmail.com',
      name: 'zakariae',
    },
  });

  const meriem = await prisma.user.upsert({
    where: { email: 'meriem@example.com' },
    update: {},
    create: {
      email: 'meriem@example.com',
      name: 'meriem',
    },
  });

  console.log('Seeded users:', { zakariae, meriem });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
