import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';


async function run() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  // We can't easily instantiate the service without NestJS container here 
  // because of dependencies, but we can just use the prisma client to find 
  // all users and then use the logic from matching.service if we had it.
  
  // Easier: Just delete all matches so they get recalculated on next login 
  // (Wait, the app doesn't automatically recalculate on login unless we added it)
  
  console.log('Cleaning up existing matches to force recalculation...');
  await prisma.match.deleteMany({});
  console.log('Matches cleared.');
  
  await prisma.$disconnect();
}

run();
