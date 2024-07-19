import { Request, Response } from "express";

import { getUsersHelper } from "../helper";

import { usersService } from "../../../services/users-service";

export const getUsersController = async (req: Request, res: Response) => {
  const sanitizedQuery = getUsersHelper(req.query as { [key: string]: string | undefined })

  const users = await usersService.allUsers(sanitizedQuery)
}