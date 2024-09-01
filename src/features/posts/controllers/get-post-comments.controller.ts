import { Response } from 'express'

import {postsQueryRepository} from "../composition-root";

import {GetAllPostsHelperResult} from "../helper";

import {RequestWithQueryAndParams} from "../../../core/request-types";

import {HTTP_STATUSES} from "../../../utils";

export const getPostCommentsController = async (req: RequestWithQueryAndParams<GetAllPostsHelperResult,{ postId: string }>, res: Response) => {
    try {
        const commentsRes = await postsQueryRepository.getPostsComments(req.query, req.params.postId)

        res.status(HTTP_STATUSES.OKK_200).json(commentsRes)
    } catch (error) {
        console.error('getPostCommentsController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }

}