import { Response } from "express"

import { RequestWithBody } from "../../../types/common"

import { AuthInputModel } from "../../../types/users-types"

import { usersService } from "../../users/domain/users-service"

import {jwtService} from "../../../application/jwtService";

import { HTTP_STATUSES } from "../../../utils"

export const loginController = async (req: RequestWithBody<AuthInputModel>, res: Response) => {
  try {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
      const tokens = await jwtService.createJWT(user);

      if (tokens) {
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
