import { Router } from 'express'

import {RateLimitMiddleware} from "../../middlewares/rate-limit.middleware";

import {AuthMiddleware, container as authContainer} from "../../middlewares/auth.middleware";
import {cookiesRefreshTokenMiddleware} from "../../middlewares/cookies-refresh-token.middleware";

import {
    createUserValidator, newPasswordValidator, passwordRecoveryValidator,
    rateLimitContainer,
    registrationConfirmationValidator,
    registrationResendingValidator
} from "./middlewares/auth.validators";

import { AuthController } from './controllers/auth.controller';

import { container } from './composition-root';

const authController = container.resolve<AuthController>(AuthController)

export const authRouter = Router({})

const authMiddleware = authContainer.get(AuthMiddleware);

const rateLimitMiddleware = rateLimitContainer.get(RateLimitMiddleware);

rateLimitMiddleware.use.bind(rateLimitMiddleware),

authRouter.post('/login', rateLimitMiddleware.use.bind(rateLimitMiddleware), authController.loginUser.bind(authController))
authRouter.get('/me', authMiddleware.use.bind(authMiddleware), authController.me.bind(authController))

authRouter.post('/registration', ...createUserValidator, authController.registerUser.bind(authController))
authRouter.post('/registration-confirmation', ...registrationConfirmationValidator, authController.registrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending', ...registrationResendingValidator, authController.regestrationEmailResending.bind(authController))

authRouter.post('/password-recovery', ...passwordRecoveryValidator, authController.passwordRecovery.bind(authController))
authRouter.post('/new-password', ...newPasswordValidator, authController.newPassword.bind(authController))

authRouter.post('/refresh-token', cookiesRefreshTokenMiddleware, authController.refreshToken.bind(authController))
authRouter.post('/logout', cookiesRefreshTokenMiddleware, authController.logoutUser.bind(authController))