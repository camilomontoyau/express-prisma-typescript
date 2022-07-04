import { Router } from "express";

const router = Router({ mergeParams: true })

import classesController from './classes.controller'
import studentsController from './students.controller'

const routes = [
  {
    path: '/:classId/students',
    controller: studentsController
  },
  {
    path: '/',
    controller: classesController
  },
]

console.log('creating routes under /courses/:id/classes')
routes.forEach(({ path, controller }) => {
  router.use(path, controller)
  console.log(`route created ${path}`)
})

export default router