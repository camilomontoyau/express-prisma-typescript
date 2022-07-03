import { Router } from "express";

const router = Router()

import coursesController from './courses.controller'
import classesController from './classes/classes.controller'

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

routes.forEach(({ path, controller }) => {
  router.use(path, controller)
  console.log(`route created ${path}`)
})

export default router