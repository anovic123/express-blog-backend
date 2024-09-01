import { Response } from 'express'

import {blogsQueryRepository, blogsService} from "../composition-root";

import {HTTP_STATUSES} from "../../../utils";

import {RequestWithParamsAndBody} from "../../../core/request-types";

import {BlogPostInputModel} from "../dto/input";

export const createBlogPostController = async (req: RequestWithParamsAndBody<{ blogId: string },BlogPostInputModel>, res: Response<BlogPostInputModel | null>) => {
    try {
        const findBlog = await blogsQueryRepository.findBlog(req.params.blogId)
        if (!findBlog) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        const newBlogPost = await blogsService.createPostBlog(findBlog.id, req.body)

        if (!newBlogPost) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res.status(HTTP_STATUSES.CREATED_201).json(newBlogPost)
    } catch (error) {
        console.error('createBlogPostController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}