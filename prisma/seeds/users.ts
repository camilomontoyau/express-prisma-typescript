import faker from 'faker'
import { 
  Roles, 
  Status, 
  User 
} from '@prisma/client'
import { v4 as uuidV4 } from 'uuid'

const users: Array<User> = [
  {
    id: uuidV4(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    status: Status.ACTIVE,
    role: Roles.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: uuidV4(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    status: Status.ACTIVE,
    role: Roles.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: uuidV4(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    status: Status.ACTIVE,
    role: Roles.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: uuidV4(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    status: Status.ACTIVE,
    role: Roles.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: uuidV4(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    status: Status.ACTIVE,
    role: Roles.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: uuidV4(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    status: Status.ACTIVE,
    role: Roles.TEACHER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
]

export default users
