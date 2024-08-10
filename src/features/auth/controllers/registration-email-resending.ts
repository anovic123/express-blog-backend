import { Response } from 'express'

import {RequestWithBody} from "../../../types/common";

import {authService} from "../domain/auth-service";

import {HTTP_STATUSES} from "../../../utils";

export const registrationEmailResending = async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const { email } = req.body

    const emailResending = await authService.resendCode(email)

    if (!emailResending) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}