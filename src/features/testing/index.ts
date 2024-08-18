import {Router} from 'express'

import { HTTP_STATUSES } from '../../utils'
import {testingService} from "./domain/testing.service";

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
    const testResult = await testingService.clearAllDB()

    if (!testResult) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})