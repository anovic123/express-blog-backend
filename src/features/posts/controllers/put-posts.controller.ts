import { Response} from 'express'

import {postsService} from "../composition-root";

import { HTTP_STATUSES } from '../../../utils'

import {RequestWithParamsAndBody} from "../../../core/request-types";

import {PostInputModel} from "../dto/input";

export const putPostController = async (req: RequestWithParamsAndBody<{id: string}, PostInputModel>, res: Response) => {
    const putRes = await postsService.putPostById(req.body, req.params.id)

    if (!putRes) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}