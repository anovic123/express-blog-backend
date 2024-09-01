import { Request, Response } from 'express'

import {securityService} from "../../security/composition-root";

import {HTTP_STATUSES} from "../../../utils";

export const refreshTokenController = async ( req: Request, res: Response ) => {
    const requestRefreshToken = req.cookies['refreshToken']

    try {
        const updatedSession = await securityService.updateSessionUser(requestRefreshToken)

        if (!updatedSession.data) {
            res.sendStatus(updatedSession.statusCode)
            return
        }

        const { accessToken, refreshToken } = updatedSession.data

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
            .header('Authorization', accessToken)
            .send({ accessToken })
    } catch (error) {
        console.log('refreshTokenController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}