import { Response } from "express"

import { RequestWithBody } from "../../../types/common"

import { AuthInputModel } from "../../../types/users-types"

import { usersService } from "../../users/domain/users-service"

import {jwtService} from "../../../application/jwtService";

import { HTTP_STATUSES } from "../../../utils"

export const loginController = async (req: RequestWithBody<AuthInputModel>, res: Response) => {
  const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
  if (user) {
    const { accessToken, refreshToken } = jwtService.createJWT(user)
    res.cookie('refreshToken ', refreshToken, {httpOnly: true, secure: true,}).header('Authorization', accessToken).send({ accessToken })
    return
  }

  res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}