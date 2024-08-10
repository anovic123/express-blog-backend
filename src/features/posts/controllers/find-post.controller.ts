import { Response } from 'express'

import {PostViewModel} from '../../../types/posts-types'

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithParams } from '../../../types/common'

import {postsQueryRepository} from "../posts-query.repository";

export const findPostController = async (req: RequestWithParams<{id: string}>, res: Response<PostViewModel | {}>) => {
    const blogById = await postsQueryRepository.getMappedPostById(req.params.id)

    if (!blogById) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    } else {
        res.status(HTTP_STATUSES.OKK_200).json(blogById)
        return
    }
}