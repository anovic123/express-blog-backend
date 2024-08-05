import { Response } from 'express'

import {RequestWithQueryAndParams} from "../../../types/common";

import { GetBlogPostsHelperResult} from "../helper";

import {blogsQueryRepository} from "../blogsQueryRepository";

export const getBlogPostsController = async (req: RequestWithQueryAndParams<GetBlogPostsHelperResult, { blogId: string }>, res: Response) => {
    const posts = await blogsQueryRepository.getBlogPosts(req.query, req.params.blogId)
    return res.status(200).json(posts)
}
