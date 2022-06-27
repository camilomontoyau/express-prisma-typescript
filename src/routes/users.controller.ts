import { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { 
  PrismaClientValidationError,
} from '@prisma/client/runtime'

const prisma = new PrismaClient();

const router = Router()

router.get('/', async(_: Request, res: Response)=>{
  try {
    // TODO: handle query params here
    // TODO: handle pagination
    const allUsers = await prisma.user.findMany(
      { 
        where: {
          deletedAt: null
        }
      }
    )
    res.status(200).json({
      items: allUsers,
    })
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.get('/:id', async(req, res)=>{
  try {
    const { id }: { id?: string } = req.params
    const user = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null, // TODO: no soft delete in prisma
      },
    })
    if(user) return res.status(200).json(user)
    res.status(404).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.post('/', async (req, res)=>{
  try {
    const { email }: { email?: string } = req.body
    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        ...req.body,
        deletedAt: null
      },
      create: {
        ...req.body,
      },
    })
    res.status(201).json(user)  
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})


router.put('/:id', async (req, res)=>{
  try {
    const { id }: { id?: string } = req.params
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null, // TODO: no soft delete in prisma
      },
    })
    if(existingUser) {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...req.body,
        },
      })
      return res.status(200).json(updatedUser)
    } 
    res.status(404).send()
  } catch (error: PrismaClientValidationError | any) {
    console.log(error) // TODO: define error logging
    return res.status(500).send()
  }
})

router.delete('/:id', async (req, res)=>{
  try {
    const { id }: { id?: string } = req.params
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null, // TODO: no soft delete in prisma
      },
    })
    if(existingUser) {
      /*
        THIS IS HARD DELETE ONLY
        const deleteUser = await prisma.user.delete({
          where: {
            id,
          },
        }) 
      */
      await prisma.user.update({
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