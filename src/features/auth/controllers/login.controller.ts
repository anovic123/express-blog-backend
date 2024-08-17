import { Response } from "express"
import { v4 as uuidv4 } from 'uuid'

import { RequestWithBody } from "../../../types/common"

import { AuthInputModel } from "../../../types/users-types"

import { usersService } from "../../users/domain/users.service"

import {jwtService} from "../application/jwt.service";

import { HTTP_STATUSES } from "../../../utils"
import {securityService} from "../../security/domain/security.service";

export const loginController = async (req: RequestWithBody<AuthInputModel>, res: Response) => {
  try {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
      const deviceId = uuidv4()

      const tokens = await jwtService.createJWT(user, deviceId);
      const userAgent = req.headers['user-agent'] || 'Unknown';
      if (tokens) {
        await securityService.addNewUserDevice({
          ip: req?.ip ?? '0.0.0.0',
          user_id: user._id,
          devices_id: deviceId,
          devices_name: userAgent,
          exp: tokens.refreshTokenExp
        })
        const { accessToken, refreshToken } = tokens;
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
            .header('Authorization', accessToken)
            .send({ accessToken });
        return;
      } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
      }
    } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
