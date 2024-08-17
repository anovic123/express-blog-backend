import { Request, Response } from 'express'

import {jwtService} from "../application/jwt.service";

import {HTTP_STATUSES} from "../../../utils";
import {securityService} from "../../security/domain/security.service";
import {securityQueryRepository} from "../../security/application/security-query.repository";
import {ObjectId} from "mongodb";

export const logoutController = async (req: Request, res: Response): Promise<void> => {
    const requestRefreshToken = req.cookies['refreshToken'];

    if (!requestRefreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return
    }

    try {
        const refreshTokenData = await jwtService.getDataFromRefreshToken(requestRefreshToken)

        if (!refreshTokenData) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return
        }
        const checkDeviceUser = await securityQueryRepository.checkUserDeviceById(new ObjectId(refreshTokenData.userId), refreshTokenData.deviceId)

        if (checkDeviceUser) {
            await securityService.deleteUserDeviceById(refreshTokenData?.deviceId);
        }

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