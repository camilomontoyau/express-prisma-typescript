import { Router } from "express";

const router = Router({ mergeParams: true })

import classesController from './classes.controller'
import studentsController from './students.controller'

const routes = [
  {
    path: '/',
    controller: classesController
  },
  {
    path: '/:classId/students',
    controller: studentsController
  },
]

routes.forEach(({ path, controller }) => {
  router.use(path, controller)
  console.log(`route created ${path}`)
})

export default router