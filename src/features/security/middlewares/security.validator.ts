import { NextFunction, Response } from "express";
import { body, validationResult, param } from 'express-validator'

import {inputCheckErrorsMiddleware} from "../../../global-middlewares/input-check-errors.middleware";
import {cookiesRefreshTokenMiddleware} from "../../../global-middlewares/cookies-refresh-token.middleware";

import {securityQueryRepository} from "../application/security-query.repository";

import {HTTP_STATUSES} from "../../../utils";

import {RequestWithParams} from "../../../types/common";

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