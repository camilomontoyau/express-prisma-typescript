import { Router } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const router = Router()

router.get('/', async(_, res)=>{
  const allUsers = await prisma.user.findMany()
  res.status(200).json({
    items: allUsers
  })
})

router.get('/:id', (req, res)=>{
  res.status(200).json({...req.params})
})

router.post('/', (req, res)=>{
  res.status(201).json(req.body)
})


router.put('/:id', (req, res)=>{
  res.status(200).json(req.body)
})

router.delete('/:id', (req, res)=>{
  res.status(204).json(req.body)
})

export default router