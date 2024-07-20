import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/inputCheckErrorsMiddleware'

const loginValidator = body('login').trim().isString().isLength({ min: 3, max: 10 })
const passwordValidator = body('password').trim().isString().isLength({ min: 6, max: 20 })
const emailValidator = body('email').trim().isEmail()

export const createUserValidator = [
  loginValidator,
  passwordValidator,
  emailValidator,
  inputCheckErrorsMiddleware
]