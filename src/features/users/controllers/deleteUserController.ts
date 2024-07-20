import { ObjectId } from "mongodb";
import { Request, Response } from 'express'
import { usersService } from '../../../services/users-service'
import { HTTP_STATUSES } from "../../../utils";

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = req.params.id

  const user = await usersService.findUserById(userId)

  if (!user || !userId) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return 
  }

  await usersService.deleteUser(new ObjectId(userId))

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}