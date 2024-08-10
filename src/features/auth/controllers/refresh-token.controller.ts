import { Request, Response } from 'express'

import {jwtService} from "../../../application/jwt.service";

import {HTTP_STATUSES} from "../../../utils";

export const refreshTokenController = async ( req: Request, res: Response ) => {
    const requestRefreshToken = req.cookies['refreshToken']
    const newTokens = await jwtService.refreshTokensJWT(requestRefreshToken)

    if (newTokens) {
        res.cookie('refreshToken ', newTokens.refreshToken, {httpOnly: true, secure: true,}).header('Authorization', newTokens.accessToken).send({ accessToken: newTokens.accessToken })
        return
    }

    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}