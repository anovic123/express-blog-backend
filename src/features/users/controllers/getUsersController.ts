import { Request, Response } from "express";

import { usersService } from "../domain/users-service";

import { getUsersHelper } from "../helper";


export const getUsersController = async (req: Request, res: Response) => {
  const sanitizedQuery = getUsersHelper(req.query as { [key: string]: string | undefined })

  const users = await usersService.allUsers(sanitizedQuery)

  res.status(200).send(users)
}