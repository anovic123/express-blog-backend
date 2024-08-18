import { Router } from 'express'

import {cookiesRefreshTokenMiddleware} from "../../global-middlewares/cookies-refresh-token.middleware";

import {deleteDeviceByIdValidator} from "./middlewares/security.validator";

import {getDevicesController} from "./controllers/get-devices.contoroller";
import {deleteAllOtherDevicesController} from "./controllers/delete-all-other-devices.controller";
import {deleteDeviceByIdController} from "./controllers/delete-device-by-id.controller";

export const securityRouter = Router()

securityRouter.get('/devices', cookiesRefreshTokenMiddleware, getDevicesController)
securityRouter.delete('/devices', cookiesRefreshTokenMiddleware, deleteAllOtherDevicesController)
securityRouter.delete('/devices/:deviceId', deleteDeviceByIdValidator, deleteDeviceByIdController)