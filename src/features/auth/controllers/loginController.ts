import { Request, Response } from "express"
import { RequestWithBody } from "../../../types"
import { AuthInputModel } from "../../../input-output-types/users-types"
import { usersService } from "../../../services/users-service"


export const loginController = async (req: RequestWithBody<AuthInputModel>, res: Response) => {
  const checkResult = await usersService.

  res.sendStatus(200)
}