import { Router } from 'express'

import { loginController } from './controllers/loginController'
import {meController} from "./controllers/meController";
import {authMiddleware} from "../../global-middlewares/auth-middleware";
import {registrationController} from "./controllers/registrationController";
import {
    createUserValidator,
    registrationConfirmationValidator,
    registrationResendingValidator
} from "./middlewares/auth-validators";
import {registrationConfirmationController} from "./controllers/registration-confirmation-controller";
import {registrationEmailResending} from "./controllers/registration-email-resending";

export const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.get('/me', authMiddleware, meController)

authRouter.post('/registration', createUserValidator, registrationController)
authRouter.post('/registration-confirmation', registrationConfirmationValidator, registrationConfirmationController)
authRouter.post('/registration-email-resending', registrationResendingValidator, registrationEmailResending)
