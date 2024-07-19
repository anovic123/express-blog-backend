import { Response } from "express";
import { usersService } from "../../../services/users-service";
import { RequestWithBody } from "../../../types";
import { UserInputModel } from "../../../input-output-types/users-types";

export const createUserController = async (req: RequestWithBody<UserInputModel>, res: Response) => {
  const newUser = await usersService.createUser(
    req.body.email,
    req.body.login,
    req.body.password
  )

  return newUser
}