import "reflect-metadata";
import { injectable, inject, Container } from "inversify";
import { NextFunction, Response } from "express";
import { validationResult, param } from 'express-validator'

import {cookiesRefreshTokenMiddleware} from "../../../middlewares/cookies-refresh-token.middleware";
import {inputCheckErrorsMiddleware} from "../../../middlewares/input-checks-errors.middleware";

import { SecurityQueryRepository } from "../infra/sequrity-query.repository";

import {RequestWithParams} from "../../../core/request-types";

import {HTTP_STATUSES} from "../../../utils";

@injectable()
export class CheckExistedDevicesValidator {
    constructor(
        @inject(SecurityQueryRepository) private securityQueryRepository: SecurityQueryRepository
    ) {}

    public async validate(req: RequestWithParams<{ deviceId: string }>, res: Response, next: NextFunction): Promise<void> {
        param('deviceId').isString().withMessage('not device id');
        const errors = validationResult(req);

        const findExistedDevices = await this.securityQueryRepository.findUserDeviceById(req.params.deviceId);

        if (!req.params.deviceId || !findExistedDevices) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).json({ messages: errors.array() });
            return;
        }

        next();
    }
}

@injectable()
export class DeleteDeviceByIdValidator {
    constructor(
        @inject(CheckExistedDevicesValidator) private checkExistedDevicesValidator: CheckExistedDevicesValidator
    ) {}

    public getMiddleware() {
        return [
            cookiesRefreshTokenMiddleware,
            this.checkExistedDevicesValidator.validate.bind(this.checkExistedDevicesValidator),
            inputCheckErrorsMiddleware
        ];
    }
}

export const containerDeleteDevice = new Container();
containerDeleteDevice.bind(SecurityQueryRepository).to(SecurityQueryRepository);
containerDeleteDevice.bind(CheckExistedDevicesValidator).to(CheckExistedDevicesValidator);
containerDeleteDevice.bind(DeleteDeviceByIdValidator).to(DeleteDeviceByIdValidator);
