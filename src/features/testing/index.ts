import {Router} from 'express'
import { HTTP_STATUSES } from '../../utils'
import {blogsRepository} from "../blogs/blogsRepository";

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
    await blogsRepository.deleteAll()
    res.status(HTTP_STATUSES.NO_CONTENT_204).json({})
})