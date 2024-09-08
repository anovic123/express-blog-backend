import { Router } from 'express'

import {createUserValidator} from "./middlewares/users.validators";
import {adminMiddleware} from "../../middlewares/admin.middleware";

import { UsersController } from './controllers/user.controller';

import { container } from './composition-root';

const usersController = container.resolve<UsersController>(UsersController)

export const usersRouter = Router()

usersRouter.post('/', adminMiddleware, ...createUserValidator, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', adminMiddleware, usersController.deleteUser.bind(usersController))
usersRouter.get('/', adminMiddleware, usersController.getUsers.bind(usersController))