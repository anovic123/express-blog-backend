import { Response } from 'express'

import { postsQueryRepository } from "../posts-query.repository";

import { HTTP_STATUSES } from '../../../utils'

import { GetAllPostsHelperResult } from "../helper";

import { RequestWithQueryAndParams } from "../../../types/common";

import { PostViewModel } from '../../../types/posts-types';

export const getPostsController = async (req: RequestWithQueryAndParams<GetAllPostsHelperResult, { id: PostViewModel['id'] }>, res: Response<any>) => {
    const posts = await postsQueryRepository.getAllPosts(req.query, req.params.id)
    return res.status(HTTP_STATUSES.OKK_200).json(posts)
}