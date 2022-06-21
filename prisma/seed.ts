// this follows what's recommended here https://planetscale.com/blog/how-to-seed-a-database-with-prisma-and-next-js
import { PrismaClient } from '@prisma/client'
import users from './seeds/users'

const prisma = new PrismaClient();


const load = async () => {
  try {
    // create users
    await prisma.user.createMany({
      data: users
    })
  } catch (e) {
      console.error(e);
      process.exit(1);
  } finally {
      await prisma.$disconnect();
  };
}

load();
