import { Response } from 'express'

import {RequestWithBody} from "../../../types/common";

import {authService} from "../application/auth.service";

import {HTTP_STATUSES} from "../../../utils";

export const registrationEmailResendingController = async (req: RequestWithBody<{ email: string }>, res: Response) => {
    try {
        const { email } = req.body

        const emailResending = await authService.resendCode(email)

        if (!emailResending) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('registrationEmailResendingController', error)
    }
}