import { NextFunction, Response } from "express";
import { validationResult, param } from 'express-validator'

import {cookiesRefreshTokenMiddleware} from "../../../global-middlewares/cookies-refresh-token.middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/input-checks-errors.middleware";

import {securityQueryRepository} from "../infra/sequrity-query.repository";

import {RequestWithParams} from "../../../types/common";

import {HTTP_STATUSES} from "../../../utils";

export const checkExistedDevicesValidator = async (req: RequestWithParams<{ deviceId: string }>, res: Response, next: NextFunction) => {
    param('deviceId').isString().withMessage('not device id')
    const errors = validationResult(req)
    const findExistedDevices = await securityQueryRepository.findUserDeviceById(req.params.deviceId)

    if (!req.params.deviceId || !findExistedDevices) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({ messages: errors.array() })
        return
    }

    next()
}

export const deleteDeviceByIdValidator = [
    cookiesRefreshTokenMiddleware,
    checkExistedDevicesValidator,
    inputCheckErrorsMiddleware
]