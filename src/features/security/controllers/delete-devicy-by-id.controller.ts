import { Response } from 'express'

import {jwtService} from "../../../core/services/jwt.service";
import {securityQueryRepository, securityService} from "../composition-root";

import {RequestWithParams} from "../../../core/request-types";

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
