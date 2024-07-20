import { Response, Request, Router } from 'express'

import { createUserController } from './controllers/createUserController'
import { deleteUserController } from './controllers/deleteUserController'
import { adminMiddleware } from '../../global-middlewares/admin-middleware'
import { getUsersController } from './controllers/getUsersController'

export const usersRouter = Router()

usersRouter.post('/', adminMiddleware, createUserController)
usersRouter.delete('/:id', adminMiddleware, deleteUserController)
usersRouter.get('/', adminMiddleware, getUsersController)