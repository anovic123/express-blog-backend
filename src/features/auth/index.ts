import { Router } from 'express'

import { loginController } from './controllers/loginController'
import {meController} from "./controllers/meController";
import {registrationEmailResending} from "./controllers/registration-email-resending";
import {registrationController} from "./controllers/registrationController";
import {registrationConfirmationController} from "./controllers/registration-confirmation-controller";
import {refreshTokenController} from "./controllers/refresh-token.controller";
import {logoutController} from "./controllers/logout.controller";

import {authMiddleware} from "../../global-middlewares/auth-middleware";
import {cookiesMiddleware} from "../../global-middlewares/cookies-middleware";

import {
    createUserValidator,
    registrationConfirmationValidator,
    registrationResendingValidator
} from "./middlewares/auth-validators";

export const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.get('/me', authMiddleware, meController)

authRouter.post('/registration', ...createUserValidator, registrationController)
authRouter.post('/registration-confirmation', ...registrationConfirmationValidator, registrationConfirmationController)
authRouter.post('/registration-email-resending', ...registrationResendingValidator, registrationEmailResending)

authRouter.post('/refresh-token', cookiesMiddleware, refreshTokenController)
authRouter.post('/logout', cookiesMiddleware, logoutController)