import { Response } from 'express'

import {RequestWithQueryAndParams} from "../../../types/common";

import { GetBlogPostsHelperResult} from "../helper";

import { HTTP_STATUSES } from '../../../utils';

import {blogsQueryRepository} from "../infra/blogs-query.repository";

export const getBlogPostsController = async (req: RequestWithQueryAndParams<GetBlogPostsHelperResult, { blogId: string }>, res: Response) => {
    try {
        const posts = await blogsQueryRepository.getBlogPosts(req.query, req.params.blogId)
        res.status(200).json(posts)
    } catch (error) {
        console.error('getBlogPostsController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}
