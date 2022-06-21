// this follows what's recommended here https://planetscale.com/blog/how-to-seed-a-database-with-prisma-and-next-js
import { PrismaClient } from '@prisma/client'
import users from './seeds/users'
import courses from './seeds/courses'

const prisma = new PrismaClient();


const load = async () => {
  try {
    console.log('=== SEEDS START ===')
    // create users
    console.log('Seeding users....')
    await prisma.user.createMany({
      data: users
    })
    console.log('Users successfuly seeded')

    // create courses
    console.log('Seeding courses....')
    await prisma.course.createMany({
      data: courses,
    })
    console.log('Courses successfuly seeded')
    
    
    console.log('=== SEEDS END ===')
  } catch (e) {
      console.error(e);
      process.exit(1);
  } finally {
      await prisma.$disconnect();
  };
}

load();
