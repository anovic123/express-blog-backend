import { Request, Response } from 'express'

import {jwtService} from "../application/jwt.service";

import {securityQueryRepository} from "../../security/infra/sequrity-query.repository";
import {securityService} from "../../security/application/security.service";

import {HTTP_STATUSES} from "../../../utils";

export const logoutController = async (req: Request, res: Response): Promise<void> => {
    const requestRefreshToken = req.cookies['refreshToken'];

    try {
        const refreshTokenData = await jwtService.getDataFromRefreshToken(requestRefreshToken)

        if (!refreshTokenData) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return
        }
        const checkDeviceUser = await securityQueryRepository.checkUserDeviceById(refreshTokenData.userId, refreshTokenData.deviceId)

        if (checkDeviceUser) {
            await securityService.deleteUserDeviceById(refreshTokenData?.deviceId);
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
}