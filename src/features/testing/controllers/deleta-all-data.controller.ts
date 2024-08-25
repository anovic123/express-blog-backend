import { Request, Response } from 'express'

import {testingService} from "../application/testing.service";

import {HTTP_STATUSES} from "../../../utils"

export const deleteAllDataController = async (req: Request, res: Response) => {
    try {
        const deleteRes = await testingService.clearAllDB()

        if (!deleteRes) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('deleteAllDataController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}