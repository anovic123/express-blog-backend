import { Router } from 'express'

import {cookiesRefreshTokenMiddleware} from "../../middlewares/cookies-refresh-token.middleware";

import {containerDeleteDevice, DeleteDeviceByIdValidator} from "./middlewares/security.validator";

import { SecurityController } from './controllers/security.controller';

import { container } from './composition-root';

const securityController = container.resolve<SecurityController>(SecurityController)

export const securityRouter = Router()

export const deleteDeviceByIdValidator = containerDeleteDevice.get(DeleteDeviceByIdValidator)

securityRouter.get('/devices', cookiesRefreshTokenMiddleware, securityController.getDevices.bind(securityController))
securityRouter.delete('/devices', cookiesRefreshTokenMiddleware, securityController.deleteAllOtherDevices.bind(securityController))
securityRouter.delete('/devices/:deviceId', deleteDeviceByIdValidator.getMiddleware(), securityController.deleteDeviceById.bind(securityController))