import { Request, Response } from 'express'

import {jwtService} from "../../../application/jwtService";

import {HTTP_STATUSES} from "../../../utils";

export const logoutController = async (req: Request, res: Response) => {
    const requestRefreshToken = req.cookies['refreshToken']

    const logoutResult = await jwtService.addTokensToBlackList(requestRefreshToken)

    if (logoutResult){
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }

    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}