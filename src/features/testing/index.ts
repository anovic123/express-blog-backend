import {Router} from 'express'
import {setDB} from '../../db/db'
import { HTTP_STATUSES } from '../../utils'

export const testingRouter = Router()

testingRouter.delete('/all-data', (req, res) => {
    setDB()
    res.status(HTTP_STATUSES.NO_CONTENT_204).json({})
})