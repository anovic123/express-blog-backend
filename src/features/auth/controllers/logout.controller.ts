import { Request, Response } from 'express'

import {jwtService} from "../../../application/jwtService";

import {HTTP_STATUSES} from "../../../utils";

export const logoutController = async (req: Request, res: Response): Promise<void> => {
    const requestRefreshToken = req.cookies['refreshToken'];

    if (!requestRefreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return
    }

    try {
        const logoutResult = await jwtService.addTokensToBlackList(requestRefreshToken);

        if (logoutResult) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            return;
        }

        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
}