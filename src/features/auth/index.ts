import { Router } from 'express'

import {rateLimitMiddleware} from "../../global-middlewares/rate-limit.middleware";
import {authMiddleware} from "../../global-middlewares/auth.middleware";
import {cookiesRefreshTokenMiddleware} from "../../global-middlewares/cookies-refresh-token.middleware";

import {loginController} from "./controllers/login.controller";
import {meController} from "./controllers/me.controller";
import {registrationController} from "./controllers/registration.controller";
import {registrationConfirmationController} from "./controllers/registration-confirmation.controller";
import {registrationEmailResendingController} from "./controllers/registration-email-resending.controller";
import {refreshTokenController} from "./controllers/refresh-token.controller";
import {logoutController} from "./controllers/logout.controller";
import {passwordRecoveryController} from "./controllers/password-recovery.controller";
import {newPasswordController} from "./controllers/new-password.controller";

import {
    createUserValidator, newPasswordValidator, passwordRecoveryValidator,
    registrationConfirmationValidator,
    registrationResendingValidator
} from "./middlewares/auth.validators";

export const authRouter = Router({})

authRouter.post('/login', rateLimitMiddleware, loginController)
authRouter.get('/me', authMiddleware, meController)

authRouter.post('/registration', ...createUserValidator, registrationController)
authRouter.post('/registration-confirmation', ...registrationConfirmationValidator, registrationConfirmationController)
authRouter.post('/registration-email-resending', ...registrationResendingValidator, registrationEmailResendingController)

authRouter.post('/password-recovery', ...passwordRecoveryValidator, passwordRecoveryController)
authRouter.post('/new-password', ...newPasswordValidator, newPasswordController)

authRouter.post('/refresh-token', cookiesRefreshTokenMiddleware, refreshTokenController)
authRouter.post('/logout', cookiesRefreshTokenMiddleware, logoutController)