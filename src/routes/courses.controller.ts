import { 
  Request, 
  Response, 
  Router,
} from "express";
import { Prisma, PrismaClient } from '@prisma/client'
import { 
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime'

const prisma = new PrismaClient();

const router = Router()

const select: Prisma.CourseSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: false, // TODO: prisma doesn't have exclude only, you need to put truthies in order to put a falsy
}

const selectClass: Prisma.ClassSelect = {
  id: true,
  name: true,
  courseId: true,
  createdAt: true,
  updatedAt: true,
}

router.get('/', async(_: Request, res: Response)=>{
  try {
    // TODO: handle query params here
    // TODO: handle pagination
    const countCourses = await prisma.course.count(
      {
        where: {
          deletedAt: null,
        }
      }
    )
    const allCourses = await prisma.course.findMany(
      { 
        where: {
          deletedAt: null
        },
        select,
      }
    )
    res.status(200).json({
      next: null, // TODO: pagination to be defined
      items: allCourses,
      total: countCourses
    })  
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.get('/:id', async(req, res)=>{
  try {
    const { id } = req.params
    const course = await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null, // TODO: no soft delete in prisma
      },
      select,
    })
    if(course) return res.status(200).json(course)
    res.status(404).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.post('/', async (req, res)=>{
  try {
    const { name }: { name?: string } = req.body
    const existingCourse = await prisma.course.findFirst({
      where: {
        name,
      },
    })
    if(existingCourse) return res.status(409).send()

    const course = await prisma.course.create({
      data: req.body,
      select,
    })
    res.status(201).json(course)  
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})


router.put('/:id', async (req, res)=>{
  const { id }: { id?: string } = req.params
  try {
    const existingCourse = await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null, // TODO: no soft delete in prisma
      },
    })
    if(existingCourse) {
      const updatedCourse = await prisma.course.update({
        where: {
          id,
        },
        data: {
          ...req.body,
        },
        select,
      })
      return res.status(200).json(updatedCourse)
    } 
    res.status(404).send()
  } catch (error: PrismaClientValidationError | PrismaClientKnownRequestError | any) {
    console.log(error)
    if ((error as PrismaClientKnownRequestError)?.code === 'P2002') {
      console.log('duplicated course', JSON.stringify({...req.body, id}))
      return res.status(409).send()
    }
    return res.status(500).send()
  }
})

router.delete('/:id', async (req, res)=>{
  try {
    const { id }: { id?: string } = req.params
    const existingCourse = await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null, // TODO: no soft delete in prisma
      },
    })
    if(existingCourse) {
      /*
        THIS IS HARD DELETE ONLY
        const deleteUser = await prisma.user.delete({
          where: {
            id,
          },
        }) 
      */
      const result = await prisma.course.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      })
      console.log(JSON.stringify({result}))
      return res.status(204).send()
    } 
    res.status(404).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

// classes routes

router.get('/:courseId/classes', async(req, res)=>{
  try {
    const courseId: string = req.params.courseId

    const where: Prisma.ClassWhereInput = {
      courseId,
      deletedAt: null,
    }

    const total: number = await prisma.class.count({ where })

    const allCourseClasses = await prisma.class.findMany({
      where,
      select: selectClass,
    })

    if(allCourseClasses) return res.status(200).json({
      next: null,
      items: allCourseClasses,
      total
    })

    res.status(404).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.get('/:courseId/classes/:id', async(req, res)=>{
  try {
    const courseId: string = req.params.courseId

    const id: string = req.params.id

    const where: Prisma.ClassWhereInput = {
      id,
      courseId,
      deletedAt: null,
    }

    const allCourseClasses = await prisma.class.findFirst({
      where,
      select: selectClass,
    })

    if(allCourseClasses) return res.status(200).json({
      items: allCourseClasses
    })
    
    res.status(404).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

export default router