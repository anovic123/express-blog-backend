import {Response} from 'express'

import {BlogInputModel, BlogViewModel} from '../../../input-output-types/blogs-types'

import {blogsRepository} from '../blogsRepository'

import {blogsQueryRepository} from "../blogsQueryRepository";

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithBody } from '../../../types'

export const createBlogController = async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
    const newBlogId = await blogsRepository.create(req.body)
    const newBlog = await blogsQueryRepository.findAndMap(newBlogId as any)

    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(newBlog as any)
}