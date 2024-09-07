import { Response } from "express";

import { authService } from "../composition-root";

import {HTTP_STATUSES} from "../../../utils";

import {RequestWithBody} from "../../../core/request-types";

export const passwordRecoveryController = async (req: RequestWithBody<{ email: string }>, res: Response) => {
    try {
        const { email } = req.body

        const emailResending = await authService.resendCodeForRecoveryPassword(email)

        if (!emailResending) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'Wrong email', field: "email" }] })
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('passwordRecoveryController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}