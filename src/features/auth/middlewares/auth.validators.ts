import "reflect-metadata";
import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { injectable, inject, Container } from "inversify";
import { RequestWithBody } from "../../../core/request-types";
import { UsersQueryRepository } from "../../users/infra/users-query.repository";
import { RateLimitMiddleware } from "../../../middlewares/rate-limit.middleware";
import { RateLimitService } from "../../../core/services/rate-limit.service";
import { RateLimitRepository } from "../../../core/infra/rate-limit.repository";
import { inputCheckErrorsMiddleware } from "../../../middlewares/input-checks-errors.middleware";

const loginValidator = body('login').trim().isString().isLength({ min: 3, max: 10 });
const passwordValidator = body('password').trim().isString().isLength({ min: 6, max: 20 });
const emailValidator = body('email').trim().isEmail();
const newPasswordBodyValidator = body('newPassword').trim().isString().isLength({ min: 6, max: 20 });
const recoveryCodeValidator = body('recoveryCode').trim().isString();
const codeValidator = body('code').trim().isString();

@injectable()
class ValidatorService {
    constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository) {}

    public async findExistedUserValidator(req: RequestWithBody<{ email: string, login: string }>, res: Response, next: NextFunction) {
        const { email, login } = req.body;
        const errors = validationResult(req);

        const existingUser = await this.usersQueryRepository.findUserByLoginOrEmail(email);
        if (existingUser) {
            res.status(400).json({ errorsMessages: [{ message: "Email already exists", field: "email" }] });
            return;
        }

        const existingLogin = await this.usersQueryRepository.findUserByLoginOrEmail(login);
        if (existingLogin) {
            res.status(400).json({ errorsMessages: [{ message: "Login already exists", field: "login" }] });
            return;
        }

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    public async findExistedUserByEmailAndConfirmedValidator(req: RequestWithBody<{ email: string }>, res: Response, next: NextFunction) {
        const { email } = req.body;
        const errors = validationResult(req);

        const existingUser = await this.usersQueryRepository.findUserByLoginOrEmail(email);
        if (!existingUser || existingUser.emailConfirmation.isConfirmed) {
            res.status(400).json({ errorsMessages: [{ message: 'Wrong email', field: "email" }] });
            return;
        }

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }
}

export const rateLimitContainer = new Container();
rateLimitContainer.bind(RateLimitMiddleware).to(RateLimitMiddleware);
rateLimitContainer.bind(UsersQueryRepository).to(UsersQueryRepository);
rateLimitContainer.bind(RateLimitService).to(RateLimitService);
rateLimitContainer.bind(RateLimitRepository).to(RateLimitRepository);
rateLimitContainer.bind(ValidatorService).to(ValidatorService);

const rateLimitMiddleware = rateLimitContainer.get(RateLimitMiddleware);
const validatorService = rateLimitContainer.get(ValidatorService);

export const registrationConfirmationValidator = [
    rateLimitMiddleware.use.bind(rateLimitMiddleware),
    codeValidator,
    inputCheckErrorsMiddleware
];

export const createUserValidator = [
    rateLimitMiddleware.use.bind(rateLimitMiddleware),
    loginValidator,
    passwordValidator,
    emailValidator,
    validatorService.findExistedUserValidator.bind(validatorService),
    inputCheckErrorsMiddleware
];

export const registrationResendingValidator = [
    rateLimitMiddleware.use.bind(rateLimitMiddleware),
    emailValidator,
    validatorService.findExistedUserByEmailAndConfirmedValidator.bind(validatorService),
    inputCheckErrorsMiddleware
];

const emailCustomValidator = body('email').trim().isString();

export const passwordRecoveryValidator = [
    rateLimitMiddleware.use.bind(rateLimitMiddleware),
    emailCustomValidator,
    inputCheckErrorsMiddleware
];

export const newPasswordValidator = [
    rateLimitMiddleware.use.bind(rateLimitMiddleware),
    newPasswordBodyValidator,
    recoveryCodeValidator,
    inputCheckErrorsMiddleware
];
