import { 
  Request, 
  Response, 
  Router,
} from "express";
import { 
  Prisma,
  PrismaClient, 
  Class,
  Course,
  User, 
} from '@prisma/client'
import { 
  PrismaClientValidationError,
} from '@prisma/client/runtime'

import { v4 as uuidV4 } from "uuid";

const prisma = new PrismaClient();

const router = Router({ mergeParams: true })

const select: Prisma.UserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true, //
  role: true,
  createdAt: true,
  updatedAt: true,
}


router.get('/', async(req: Request, res: Response)=>{
  try {
    const courseId: string = req.params.courseId
    const classId: string = req.params.classId

    // check course exists 
    const existingCourse: Course | null = await prisma.course.findFirst({
      where: {
        id: courseId,
        deletedAt: null // course shouldn't be softdeleted
      }
    })

    if(!existingCourse) {
      return res.status(404).json({
        id: uuidV4(),
        message: 'course not found'
      })
    }

    const existingClass: Class | null = await prisma.class.findFirst({
      where: {
        id: classId,
        courseId,
        deletedAt: null
      }
    })

    if(!existingClass) {
      return res.status(404).json({
        id: uuidV4(),
        message: 'class not found'
      })
    }

    const where: Prisma.UserClassesWhereInput = {
      classId,
      user: {
        deletedAt: null
      }
    }

    const total: number = await prisma.userClasses.count({ 
      where,
    })

    const allClassStudents = await prisma.userClasses.findMany({
      where,
      select: {
        user: {
          select
        }
      }
    })

    if(allClassStudents) {
      return res.status(200).json({
        next: null,
        items: allClassStudents.map(({user})=>user),
        total
      })
    }

    res.status(404).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.post('/', async (req: Request, res: Response)=>{
  try {
    const courseId: string  = req.params.courseId
    const classId: string  = req.params.classId
    const userId: string = req.body.userId

    const existingUser: User | null = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null
      }
    })

    if(!existingUser) {
      return res.status(404).json({
        id: uuidV4(),
        message: 'user not found'
      })
    }

    const existingCourse = await prisma.course.findFirst({
      where: {
        id: courseId,
        deletedAt: null, // TODO: no soft delete in prisma
      },
    })

    if(!existingCourse) {
      return res.status(404).json({
        id: uuidV4(),
        message: 'course not found'
      })
    }

    const existingClass: Class | null = await prisma.class.findFirst({
      where: {
        id: classId,
        courseId,
        deletedAt: null
      }
    })

    if(!existingClass) {
      return res.status(404).json({
        id: uuidV4(),
        message: 'class not found'
      })
    }

    const newUserClassData = {
      classId,
      userId,
    }

    await prisma.userClasses.create({
      data: newUserClassData,
    })

    res.status(201).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

// other routes/methods/handlers related to stundents are under /users routes

export default router