import { Response} from 'express'

import {postsService} from "../domain/posts-service";

import { PostInputModel } from '../../../input-output-types/posts-types'

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithParamsAndBody } from '../../../types'

export const putPostController = async (req: RequestWithParamsAndBody<{id: string}, PostInputModel>, res: Response) => {
    const putRes =  await postsService.putPostById(req.body, req.params.id)

    if (!putRes) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}