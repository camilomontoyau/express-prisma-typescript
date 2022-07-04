import { 
  Request, 
  Response, 
  Router,
} from "express";
import { 
  Prisma,
  PrismaClient, 
  Class,
  Course 
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
  email: true,
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

// other routes/methods/handlers related to stundents are under /users routes

export default router