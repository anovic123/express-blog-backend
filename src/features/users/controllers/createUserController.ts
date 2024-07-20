import { Response } from "express";
import { usersService } from "../../../services/users-service";
import { RequestWithBody } from "../../../types";
import { UserInputModel } from "../../../input-output-types/users-types";

export const createUserController = async (req: RequestWithBody<UserInputModel>, res: Response) => {
  const newUser = await usersService.createUser(
    req.body.login,
    req.body.email,
    req.body.password
  )

  return res.status(201).send(newUser)
}