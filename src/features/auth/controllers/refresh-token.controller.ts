import { Request, Response } from 'express'

import {jwtService} from "../application/jwt.service";

import {securityService} from "../../security/domain/security.service";

import {HTTP_STATUSES} from "../../../utils";

export const refreshTokenController = async ( req: Request, res: Response ) => {
    const requestRefreshToken = req.cookies['refreshToken']

    try {
        const newTokens = await jwtService.refreshTokensJWT(requestRefreshToken)
        if (newTokens) {
            const { accessToken, refreshToken, refreshTokenExp } = newTokens

            const refreshTokenData = await jwtService.getDataFromRefreshToken(refreshToken)
            if (refreshTokenData) {
                const { userId, deviceId } = refreshTokenData
                await securityService.updateSessionUser(userId, deviceId, refreshTokenExp)
            }

            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
                .header('Authorization', accessToken)
                .send({ accessToken })
            return
        }

        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    } catch (error) {
        console.log('refreshTokenController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}