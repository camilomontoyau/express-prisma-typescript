import faker from 'faker'
import { 
  Course 
} from '@prisma/client'
import { v4 as uuidV4 } from 'uuid'

const courses: Course[] = [
  {
    id: uuidV4(),
    name: faker.animal.dog(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: uuidV4(),
    name: faker.animal.cat(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
]

export default courses
