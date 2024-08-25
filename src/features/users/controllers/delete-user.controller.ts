import { Response } from 'express'

import {usersService} from "../application/users.service";

import {RequestWithParams} from "../../../types/common";

import {HTTP_STATUSES} from "../../../utils";

export const deleteUserController = async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const userId = req.params.id

    try {
        const user = await usersService.findUserById(userId)

        await usersService.deleteUser(userId)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('deleteUserController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}