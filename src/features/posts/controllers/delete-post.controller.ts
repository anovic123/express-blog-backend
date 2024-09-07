import {Response} from 'express'

import {postsService} from "../composition-root";

import { HTTP_STATUSES } from '../../../utils'

import {RequestWithParams} from "../../../core/request-types";

export const deletePostController = async (req: RequestWithParams<{id: string}>, res: Response) => {
    try {
        await postsService.delPostById(req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('deletePostController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}