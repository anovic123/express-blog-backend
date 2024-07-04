import {Request, Response} from 'express'
import {postsRepository} from '../postsRepository'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithParams } from '../../../types'

export const delPostController = async (req: RequestWithParams<{id: string}>, res: Response) => {
    await postsRepository.del(req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}