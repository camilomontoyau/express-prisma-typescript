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
    const countUsers = await prisma.user.count(
      {
        where: {
          deletedAt: null,
        }
      }
    )
    const allUsers = await prisma.user.findMany(
      { 
        where: {
          deletedAt: null
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          status: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          // TODO: this is a way to exclude deletedAt check the other at courses.controller.ts
        },
      }
    )
    res.status(200).json({
      next: null, // TODO: define pagination
      items: allUsers,
      total: countUsers
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
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
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
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
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
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          status: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
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
          deletedAt: new Date(),
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