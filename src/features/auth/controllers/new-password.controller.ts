import { Response } from 'express'

import { authService } from '../composition-root';

import {HTTP_STATUSES} from "../../../utils";

import {RequestWithBody} from "../../../core/request-types";

export const newPasswordController = async (req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: Response) => {
    try {
        const newPasswordRes = await authService.changeNewPassword({
            newPassword: req.body.newPassword,
            recoveryCode: req.body.recoveryCode
        })
        if (!newPasswordRes) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'Wrong recoveryCode', field: "recoveryCode" }] })
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('newPasswordController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}