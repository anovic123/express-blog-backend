import { Response, NextFunction } from 'express'
import { body } from 'express-validator'

import {usersQueryRepository} from "../../users/infra/users-query.repository";

import {rateLimitMiddleware} from "../../../global-middlewares/rate-limit.middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/input-checks-errors.middleware";

import { RequestWithBody } from "../../../types/common";

import { HTTP_STATUSES } from "../../../utils";

const loginValidator = body('login').trim().isString().isLength({ min: 3, max: 10 })
const passwordValidator = body('password').trim().isString().isLength({ min: 6, max: 20 })
const emailValidator = body('email').trim().isEmail()

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