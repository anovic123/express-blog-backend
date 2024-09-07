import { Request, Response } from 'express'

import {usersService} from "../composition-root";

import {HTTP_STATUSES} from "../../../utils";

import {getUsersHelper} from "../helper";

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const sanitizedQuery = getUsersHelper(req.query as { [key: string]: string | undefined })

        const users = await usersService.allUsers(sanitizedQuery)

        res.status(200).send(users)
    } catch (error) {
        console.error('getUsersController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}