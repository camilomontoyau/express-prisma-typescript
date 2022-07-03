import { Router } from "express";

const router = Router()

import coursesController from './courses.controller'
import classesController from './classes.controller'

const routes = [
  {
    path: '/courses',
    controller: coursesController,
  },
  {
    path: '/courses/:courseId/classes',
    controller: classesController
  },
]

routes.forEach(({ path, controller }) => {
  router.use(path, controller)
  console.log(`route created ${path}`)
})

export default router