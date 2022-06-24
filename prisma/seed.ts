// this follows what's recommended here https://planetscale.com/blog/how-to-seed-a-database-with-prisma-and-next-js
import { Class, PrismaClient, UserClasses } from '@prisma/client'
import users from './seeds/users'
import courses from './seeds/courses'
import {generateClasses} from './seeds/classes'
import { generateStudentsClasses } from './seeds/students-classes'

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
    
    
    // create classes
    console.log('Seeding classes....')
    const classes: Class[] = generateClasses(courses, users)
    await prisma.class.createMany({
      data: classes,
    })
    console.log('Classes successfuly seeded')
    
    // add students to classes
    console.log('Seeding students to classes....')
    const studentsClasses: UserClasses[] = generateStudentsClasses(classes, users)
    await prisma.userClasses.createMany({
      data: studentsClasses,
    })
    console.log('Students successfuly added to classes')
    console.log('=== SEEDS END ===')
  } catch (e) {
      console.error(e);
      process.exit(1);
  } finally {
      await prisma.$disconnect();
  };
}

load();
