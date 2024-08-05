import { Response } from 'express'

import {RequestWithBody} from "../../../types/common";

import {HTTP_STATUSES} from "../../../utils";

import {authService} from "../domain/auth-service";

export const registrationController = async (req: RequestWithBody<{
    login: string,
    password: string,
    email: string
}>, res: Response) => {

    const user = await authService.createUser(req.body.login, req.body.email, req.body.password)

    if (user) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }

    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
}
