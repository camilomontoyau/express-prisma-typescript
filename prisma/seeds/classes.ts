import faker from 'faker'
import { 
  Class,
  Course,
  Roles,
  User, 
} from '@prisma/client'
import { v4 as uuidV4 } from 'uuid'
import { generateRandomNumber } from '../../utils/random-number'


export const generateClasses = (courses: Course[], users: User[] ) => {
  const teacher: User | undefined = users.find((user)=>user.role === Roles.TEACHER)
  
  const classes: Class[] = [
    {
      id: uuidV4(),
      name: faker.animal.dog(),
      courseId: courses[generateRandomNumber(0, courses.length - 1)].id,
      teacher: teacher?.id || null,
      start: new Date(),
      end: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    },
    {
      id: uuidV4(),
      name: faker.animal.dog(),
      courseId: courses[generateRandomNumber(0, courses.length - 1)].id,
      teacher: teacher?.id || null,
      start: new Date(),
      end: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    },
  ]

  return classes
}
