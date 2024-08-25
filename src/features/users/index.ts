import { Router } from 'express'

import {createUserValidator} from "./middlewares/users.validators";
import {adminMiddleware} from "../../global-middlewares/admin.middleware";

import {createUserController} from "./controllers/create-user.controller";
import {deleteUserController} from "./controllers/delete-user.controller";
import {getUsersController} from "./controllers/get-users.controller";

export const usersRouter = Router()

usersRouter.post('/', adminMiddleware, ...createUserValidator, createUserController)
usersRouter.delete('/:id', adminMiddleware, deleteUserController)
usersRouter.get('/', adminMiddleware, getUsersController)