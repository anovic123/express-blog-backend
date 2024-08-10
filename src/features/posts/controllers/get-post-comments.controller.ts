import { Response } from 'express'

import {postsQueryRepository} from "../posts-query.repository";

import {GetAllPostsHelperResult} from "../helper";

import {RequestWithQueryAndParams} from "../../../types/common";

import {HTTP_STATUSES} from "../../../utils";

export const getPostCommentsController = async (req: RequestWithQueryAndParams<GetAllPostsHelperResult,{ postId: string }>, res: Response) => {
const commentsRes = await postsQueryRepository.getPostsComments(req.query, req.params.postId)

    return res.status(HTTP_STATUSES.OKK_200).json(commentsRes)
}