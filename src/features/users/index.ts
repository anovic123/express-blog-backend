import { Router } from 'express'

import { createUserController } from './controllers/create-user.controller'
import { deleteUserController } from './controllers/delete-user.controller'
import { adminMiddleware } from '../../global-middlewares/admin.middleware'
import { getUsersController } from './controllers/get-users.controller'
import { createUserValidator } from './middlewares/users.validators'

export const usersRouter = Router()

usersRouter.post('/', adminMiddleware, ...createUserValidator, createUserController)
usersRouter.delete('/:id', adminMiddleware, deleteUserController)
usersRouter.get('/', adminMiddleware, getUsersController)