import { Request, Response } from 'express'

import {jwtService} from "../../../core/services/jwt.service";

import {securityService} from "../composition-root";

import {HTTP_STATUSES} from "../../../utils";

export const deleteAllOtherDevicesController = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies['refreshToken']

        const refreshTokenData = await jwtService.getDataFromRefreshToken(refreshToken);

        if (!refreshTokenData) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const { userId, deviceId } = refreshTokenData;

        const deleteResult = await securityService.deleteUserDeviceByIdAll(deviceId, userId);

        if (deleteResult) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    } catch (error) {
        console.error('deleteAllOtherDevicesController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}