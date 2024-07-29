import { Response } from 'express'

import { postsQueryRepository } from "../postsQueryRepository";

import { HTTP_STATUSES } from '../../../utils'

import { GetAllPostsHelperResult } from "../helper";

import { RequestWithQueryAndParams } from "../../../types/common";

import { PostDbType } from "../../../db/post-db-type";

export const getPostsController = async (req: RequestWithQueryAndParams<GetAllPostsHelperResult, { id: PostDbType['id'] }>, res: Response<any>) => {
    const posts = await postsQueryRepository.getAllPosts(req.query, req.params.id)
    return res.status(HTTP_STATUSES.OKK_200).json(posts)
}