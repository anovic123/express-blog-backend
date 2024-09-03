import { Response } from 'express'

import {HTTP_STATUSES} from "../../../utils";

import { authService } from '../composition-root';

import {RequestWithBody} from "../../../core/request-types";

export const registrationController = async (req: RequestWithBody<{
    login: string,
    password: string,
    email: string
}>, res: Response) => {
    try {
        const user = await authService.createUser(req.body.login, req.body.email, req.body.password)

        if (user) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }

        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    } catch (error) {
        console.error('registrationController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}
