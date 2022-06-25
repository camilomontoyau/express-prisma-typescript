import { Router } from "express";

const router = Router()

router.get('/', (_, res)=>{
  res.status(200).json({
    items: []
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