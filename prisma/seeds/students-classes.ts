import { 
  Class,
  Roles,
  User,
  UserClasses, 
} from '@prisma/client'
import { v4 as uuidV4 } from 'uuid'
import { generateRandomNumber } from '../../utils/random-number'


export const generateStudentsClasses = (classes: Class[], users: User[] ) => {
  let students: User[] = users.filter(user=>user.role === Roles.STUDENT)
  
  const studentsClasses: UserClasses[] = [...Array(students.length).keys()].map(()=>{
    let randomStudentIndex : number = generateRandomNumber(0, students.length - 1)
    let student: User = students[randomStudentIndex]
    const studentClass: UserClasses = {
      id: uuidV4(),
      userId: student.id,
      classId: classes[generateRandomNumber(0, classes.length - 1)].id,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    } 
    students = students.filter(user=>user.id !== student.id)
    return studentClass
  })
  return studentsClasses
}
