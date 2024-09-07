import { Response } from 'express'

import { HTTP_STATUSES } from '../../../utils'

import {RequestWithParams} from "../../../core/request-types";

import {postsQueryRepository} from "../composition-root";

import {PostViewModel} from "../dto/output";

export const findPostController = async (req: RequestWithParams<{id: PostViewModel['id']}>, res: Response<PostViewModel | {}>) => {
    try {
        const blogById = await postsQueryRepository.getMappedPostById(req.params.id)

        if (!blogById) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.OKK_200).json(blogById)
    } catch (error) {
        console.error('findPostController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}