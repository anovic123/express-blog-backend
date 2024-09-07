import { Response, NextFunction } from 'express'
import { body } from 'express-validator'

import {usersQueryRepository} from "../../users/composition-root";

import {rateLimitMiddleware} from "../../../middlewares/rate-limit.middleware";
import {inputCheckErrorsMiddleware} from "../../../middlewares/input-checks-errors.middleware";

import { HTTP_STATUSES } from "../../../utils";

import {RequestWithBody} from "../../../core/request-types";

const loginValidator = body('login').trim().isString().isLength({ min: 3, max: 10 })
const passwordValidator = body('password').trim().isString().isLength({ min: 6, max: 20 })
const emailValidator = body('email').trim().isEmail()
const newPasswordBodyValidator = body('newPassword').trim().isString().isLength({ min: 6, max: 20 })
const recoveryCodeValidator = body('recoveryCode').trim().isString()

const codeValidator = body('code').trim().isString()

const findExistedUserValidator = async (req: RequestWithBody<{ email: string, login: string }>, res: Response, next: NextFunction) => {
    const { email, login } = req.body;

    const existingUser = await usersQueryRepository.findUserByLoginOrEmail(email);
    if (existingUser) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: "Email already exists", field: "email" }] });
        return
    }

    const existingLogin = await usersQueryRepository.findUserByLoginOrEmail(login);
    if (existingLogin) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: "Login already exists", field: "login" }] });
        return
    }

    next()
}

const findExistedUserByEmailAndConfirmedValidator = async (req: RequestWithBody<{ email: string }>, res: Response, next: NextFunction) => {
    const { email } = req.body

    const existingUser = await usersQueryRepository.findUserByLoginOrEmail(email)

    if (!existingUser) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'Wrong email', field: "email" }] })
        return
    }

    if (existingUser.emailConfirmation.isConfirmed) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'Wrong email', field: "email" }] });
        return
    }

    next()
}

export const registrationConfirmationValidator = [
    rateLimitMiddleware,
    codeValidator,
    inputCheckErrorsMiddleware
]

export const createUserValidator = [
    rateLimitMiddleware,
    loginValidator,
    passwordValidator,
    emailValidator,
    findExistedUserValidator,
    inputCheckErrorsMiddleware
]

export const registrationResendingValidator = [
    rateLimitMiddleware,
    emailValidator,
    findExistedUserByEmailAndConfirmedValidator,
    inputCheckErrorsMiddleware
]

const emailCustomValidator = body('email').trim().isString()

export const passwordRecoveryValidator = [
    rateLimitMiddleware,
    emailCustomValidator,
    inputCheckErrorsMiddleware
]

export const newPasswordValidator = [
    rateLimitMiddleware,
    newPasswordBodyValidator,
    recoveryCodeValidator,
    inputCheckErrorsMiddleware
]
