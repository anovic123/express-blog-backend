import { Response } from 'express'

import {usersService} from "../../users/application/users.service";
import {securityService} from "../../security/application/security.service";

import {RequestWithBody} from "../../../types/common";
import {AuthInputModel} from "../../../types/users-types";

import {HTTP_STATUSES} from "../../../utils";

export const loginController = async (req: RequestWithBody<AuthInputModel>, res: Response<{ accessToken: string }>) => {
    try {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
        const userAgent = req.headers['user-agent'] || 'Unknown';

        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return
        }

        const newDeviceRes = await securityService.addNewUserDevice(user, req?.ip, userAgent)

        if (!newDeviceRes.data) {
            res.sendStatus(newDeviceRes.statusCode)
            return
        }

        const { accessToken, refreshToken } = newDeviceRes.data

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
            .header('Authorization', accessToken)
            .send({ accessToken });
    } catch (error) {
        console.error('loginController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
};
