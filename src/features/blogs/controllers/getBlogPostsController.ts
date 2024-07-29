import { Request, Response } from 'express'

import {RequestWithParams, RequestWithQueryAndParams} from "../../../types/common";

import {getBlogPostsHelper, GetBlogPostsHelperResult} from "../helper";

import {blogsRepository} from "../blogsRepository";
import {blogsQueryRepository} from "../blogsQueryRepository";

export const getBlogPostsController = async (req: RequestWithQueryAndParams<GetBlogPostsHelperResult, { blogId: string }>, res: Response) => {
    const posts = await blogsQueryRepository.getBlogPosts(req.query, req.params.blogId)
    return res.status(200).json(posts)
}