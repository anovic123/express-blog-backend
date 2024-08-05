import { Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/inputCheckErrorsMiddleware'
import {RequestWithBody} from "../../../types/common";
import {usersQueryRepository} from "../../users/usersQueryRepository";
import {HTTP_STATUSES} from "../../../utils";

const loginValidator = body('login').trim().isString().isLength({ min: 3, max: 10 })
const passwordValidator = body('password').trim().isString().isLength({ min: 6, max: 20 })
const emailValidator = body('email').trim().isEmail()

const codeValidator = body('code').trim().isString()

const findExistedUserValidator = async (req: RequestWithBody<{ email: string }>, res: Response, next: NextFunction) => {
    const user = await usersQueryRepository.findUserByLoginOrEmail(req.body.email)

    if (user) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
            errorsMessages: [
                {
                    message: "email already exists",
                    field: "email"
                }
            ]
        })
        return
    }

    next()
}

export const registrationConfirmationValidator = [
    codeValidator,
    inputCheckErrorsMiddleware
]

export const createUserValidator = [
  loginValidator,
  passwordValidator,
  emailValidator,
  findExistedUserValidator,
  inputCheckErrorsMiddleware
]