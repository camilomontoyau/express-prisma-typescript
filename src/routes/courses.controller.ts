import { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { 
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime'

const prisma = new PrismaClient();

const router = Router()

router.get('/', async(_: Request, res: Response)=>{
  try {
    // TODO: handle query params here
    // TODO: handle pagination
    const allCourses = await prisma.course.findMany()
    res.status(200).json({
      items: allCourses,
      deletedAt: null // TODO: no soft delete in prisma
    })  
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.get('/:id', async(req, res)=>{
  try {
    const { id }: { id?: string } = req.params
    const course = await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null, // TODO: no soft delete in prisma
      },
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
      await prisma.course.update({
        where: {
          id,
        },
        data: {
          deletedAt: null,
        },
      })
      return res.status(204).send()
    } 
    res.status(404).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

export default router