import { 
  Request, 
  Response, 
  Router,
} from "express";
import { 
  Prisma,
  PrismaClient, 
  Class, /* Roles, */ 
  Course 
} from '@prisma/client'
import { 
  PrismaClientValidationError,
  //PrismaClientKnownRequestError,
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

/*

router.get('/:id', async(req: Request, res: Response)=>{
  try {
    const courseId: string = req.params.courseId

    const id: string = req.params.id

    const where: Prisma.ClassWhereInput = {
      id,
      courseId,
      deletedAt: null,
    }

    const courseClass = await prisma.class.findFirst({
      where,
      select: selectClass,
    })

    if(courseClass) return res.status(200).json(courseClass)
    
    res.status(404).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.post('/', async (req: Request, res: Response)=>{
  try {
    const { courseId }: { courseId?: string } = req.params
    const { name }: { name?: string } = req.body

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


    if(req.body.teacher) {
      const existingTeacher = await prisma.user.findFirst({
        where: {
          id: req.body.teacher,
          role: Roles.TEACHER,
          deletedAt: null, // TODO: no soft delete in prisma
        },
      })
      if(!existingTeacher) {
        return res.status(404).json({
          id: uuidV4(),
          message: 'teacher not found'
        })
      }
    }

    const existingClass = await prisma.class.findFirst({////
      where: {
        courseId,
        name,
      },
    })
    if(existingClass) {
      return res.status(409).json({
        id: uuidV4(),
        message: 'Duplicated class'
      })
    }

    const newClassData: Class = {
      ...req.body,
      courseId,
    }

    const newClass = await prisma.class.create({
      data: newClassData,
      select: selectClass,
    })

    res.status(201).json(newClass)  
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.put('/:id', async (req: Request, res: Response)=>{
  try {
    const { courseId, id }: { courseId?: string, id?: string } = req.params
    
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

    if(req.body.teacher) {
      const existingTeacher = await prisma.user.findFirst({
        where: {
          id: req.body.teacher,
          role: Roles.TEACHER,
          deletedAt: null, // TODO: no soft delete in prisma
        },
      })
      if(!existingTeacher) {
        return res.status(404).json({
          id: uuidV4(),
          message: 'teacher not found'
        })
      }
    }

    const existingClass = await prisma.class.findFirst({
      where: {
        courseId,
        id,
        deletedAt: null,
      },
    })

    if(!existingClass) {
      return res.status(404).json({
        id: uuidV4(),
        message: 'Class not found'
      })
    }

    const newDataForClass: Class = {
      ...req.body,
      courseId,
      id,
    }

    
    const updatedCourse = await prisma.class.update({
      where: {
        id,
      },
      data: {
        ...newDataForClass,
      },
      select: selectClass,
    })
    
    res.status(200).json(updatedCourse)  
  } catch (error: PrismaClientValidationError | PrismaClientKnownRequestError | any) {
    console.log(error)
    if ((error as PrismaClientKnownRequestError)?.code === 'P2002') {
      console.log('duplicated course', JSON.stringify({...req.body}))
      return res.status(409).send()
    }
    return res.status(500).send()
  }
})

router.delete('/:id', async(req: Request, res: Response)=>{
  try {
    const courseId: string = req.params.courseId

    const id: string = req.params.id

    const where: Prisma.ClassWhereInput = {
      id,
      courseId,
      deletedAt: null,
    }

    const courseClass = await prisma.class.findFirst({
      where,
      select: selectClass,
    })

    if(!courseClass) return res.status(404).send()

    await prisma.class.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
    return res.status(204).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})
*/

export default router