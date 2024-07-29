import { Response } from 'express'

import {RequestWithBody} from "../../../types/common";

import {HTTP_STATUSES} from "../../../utils";

import {authService} from "../domain/auth-service";``

export const registrationConfirmationController = async (req: RequestWithBody<{ code: string }>, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)

    if (result) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }

    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}