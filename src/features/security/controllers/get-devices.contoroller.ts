import { Response } from 'express';
import { ObjectId } from "mongodb";

import {jwtService} from "../../auth/application/jwt.service";

import { RequestAuthModel } from "../../../types/common";

import { securityQueryRepository } from "../application/security-query.repository";

import { HTTP_STATUSES } from "../../../utils";

export const getDevicesController = async (req: RequestAuthModel, res: Response) => {
    try {
        const resultData = await jwtService.getDataFromRefreshToken(req.cookies['refreshToken'])
        if (!resultData?.userId) {
            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
        const devices = await securityQueryRepository.getAllDevicesSessions(new ObjectId(resultData?.userId));
        return res.status(HTTP_STATUSES.OKK_200).json(devices);
    } catch (error) {
        console.error('Error in getDevicesController:', error);
        return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
};
