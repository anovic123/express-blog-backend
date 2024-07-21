import { Response } from "express"

import { RequestWithBody } from "../../../types"

import { AuthInputModel } from "../../../input-output-types/users-types"

import { usersService } from "../../users/services/users-service"

import { HTTP_STATUSES } from "../../../utils"

export const loginController = async (req: RequestWithBody<AuthInputModel>, res: Response) => {
  const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

  if (!checkResult) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    return
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}