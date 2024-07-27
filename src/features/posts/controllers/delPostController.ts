import {Response} from 'express'

import {postsService} from "../domain/posts-service";

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithParams } from '../../../types'

export const delPostController = async (req: RequestWithParams<{id: string}>, res: Response) => {
    await postsService.delPostById(req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}