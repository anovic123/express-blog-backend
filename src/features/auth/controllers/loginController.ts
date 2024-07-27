import { Response } from "express"

import { RequestWithBody } from "../../../types"

import { AuthInputModel } from "../../../input-output-types/users-types"

import { usersService } from "../../users/domain/users-service"

import {jwtService} from "../../../application/jwtService";

import { HTTP_STATUSES } from "../../../utils"

export const loginController = async (req: RequestWithBody<AuthInputModel>, res: Response) => {
  const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
  if (user) {
    const token = await jwtService.createJWT(user)
    res.status(HTTP_STATUSES.OKK_200).send({
      accessToken: token
    })
    return
  }

  res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}