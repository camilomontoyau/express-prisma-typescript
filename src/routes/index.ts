import { Router } from "express";

const router = Router()

import coursesController from './courses'
import usersController from './users.controller'

const routes = [
  {
    path: '/users',
    controller: usersController,
  },
  {
    path: '/courses',
    controller: coursesController,
  },
]

console.log('creating main routes')
routes.forEach(({ path, controller }) => {
  router.use(path, controller)
  console.log(`route created ${path}`)
})

export default router