import { Response } from 'express'

import {RequestWithParamsAndBody} from "../../../types/common";

import {BlogPostInputModel} from "../../../types/blogs-types";

import {HTTP_STATUSES} from "../../../utils";

import {blogsRepository} from "../blogsRepository";
import {blogsQueryRepository} from "../blogsQueryRepository";

export const createBlogPostController = async (req: RequestWithParamsAndBody<{ blogId: string },BlogPostInputModel>, res: Response<BlogPostInputModel | null>) => {
    const findBlog = await blogsQueryRepository.findBlog(req.params.blogId)
    if (!findBlog) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const newBlogPost = await blogsRepository.createPostBlog(findBlog.id, req.body)

    if (!newBlogPost) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    res.status(HTTP_STATUSES.CREATED_201).json(newBlogPost)
}