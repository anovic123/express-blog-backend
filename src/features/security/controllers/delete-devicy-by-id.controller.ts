import { Response } from 'express'

import {jwtService} from "../../auth/application/jwt.service";
import {securityService} from "../application/security.service";

import {securityQueryRepository} from "../infra/sequrity-query.repository";

import {RequestWithParams} from "../../../types/common";

import {HTTP_STATUSES} from "../../../utils";

export const deleteDeviceByIdController = async (req: RequestWithParams<{ deviceId: string }>, res: Response) => {
    const deviceId = req.params.deviceId

    try {
        const refreshToken = req.cookies['refreshToken'];

        const refreshTokenData = await jwtService.getDataFromRefreshToken(refreshToken);

        if (!refreshTokenData) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const userId = refreshTokenData.userId

        const checkDeviceUser = await securityQueryRepository.checkUserDeviceById(userId, deviceId)

        if (!checkDeviceUser) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN)
            return
        }

        await securityService.deleteUserDeviceById(deviceId)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }  catch (error) {
        console.log('deleteDeviceByIdController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}
