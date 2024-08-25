import { Response } from "express";

import {authService} from "../application/auth.service";

import {RequestWithBody} from "../../../types/common";

import {HTTP_STATUSES} from "../../../utils";

export const passwordRecoveryController = async (req: RequestWithBody<{ email: string }>, res: Response) => {
    try {
        const { email } = req.body

        const emailResending = await authService.resendCodeForRecoveryPassword(email)

        if (!emailResending) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('passwordRecoveryController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}