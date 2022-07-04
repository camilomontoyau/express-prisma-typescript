import { Router } from "express";

const router = Router()

import coursesController from './courses.controller'
import classesController from './classes'

const routes = [
  {
    path: '/',
    controller: coursesController,
  },
  {
    path: '/:courseId/classes',
    controller: classesController
  },
]

console.log('creating routes under /courses')
routes.forEach(({ path, controller }) => {
  router.use(path, controller)
  console.log(`route created ${path}`)
})

export default router