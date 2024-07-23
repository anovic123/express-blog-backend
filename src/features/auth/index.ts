import { Router } from 'express'

import { loginController } from './controllers/loginController'
import {meController} from "./controllers/meController";
import {authMiddleware} from "../../global-middlewares/auth-middleware";

export const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.get('/me', authMiddleware, meController)