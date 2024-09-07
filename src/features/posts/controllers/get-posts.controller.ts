import { Response } from 'express'

import {postsQueryRepository} from "../composition-root";

import { HTTP_STATUSES } from '../../../utils'

import { GetAllPostsHelperResult } from "../helper";

import {RequestWithQueryAndParams} from "../../../core/request-types";

import {PostViewModel} from "../dto/output";

export const getPostsController = async (req: RequestWithQueryAndParams<GetAllPostsHelperResult, { id: PostViewModel['id'] }>, res: Response<any>) => {
    try {
        const posts = await postsQueryRepository.getAllPosts(req.query, req.params.id)
        res.status(HTTP_STATUSES.OKK_200).json(posts)
    } catch (error) {
        console.error('getPostsController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}