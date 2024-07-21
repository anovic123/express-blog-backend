import { Response } from "express";

import { RequestWithBody } from "../../../types";

import { UserInputModel } from "../../../input-output-types/users-types";

import { HTTP_STATUSES } from "../../../utils";

import { usersService } from "../services/users-service";

export const createUserController = async (req: RequestWithBody<UserInputModel>, res: Response) => {
  const findUser = await usersService.checkUnique(req.body.login, req.body.password)

  if (!findUser) {
    res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
      errorsMessages: [{field: 'email', message: 'email should be unique'}]
      })
    return
  }

  const newUser = await usersService.createUser(
    req.body.login,
    req.body.email,
    req.body.password
  )

  return res.status(HTTP_STATUSES.CREATED_201).json(newUser)
}