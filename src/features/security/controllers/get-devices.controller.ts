import { Response } from 'express'

import {jwtService} from "../../../core/services/jwt.service";

import {securityQueryRepository} from "../composition-root";

import {RequestAuthModel} from "../../../core/request-types";

import {HTTP_STATUSES} from "../../../utils";

export const getDevicesController = async (req: RequestAuthModel, res: Response) => {
    try {
        const resultData = await jwtService.getDataFromRefreshToken(req.cookies['refreshToken'])
        if (!resultData?.userId) {
            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
        const devices = await securityQueryRepository.getAllDevicesSessions(resultData?.userId)
        return res.status(HTTP_STATUSES.OKK_200).json(devices);
    } catch (error) {
        console.error('Error in getDevicesController:', error);
        return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
};
