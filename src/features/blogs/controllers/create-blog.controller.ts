import {Response} from 'express'

import {BlogInputModel, BlogViewModel} from '../../../types/blogs-types'

import {blogsRepository} from '../blogs.repository'

import {blogsQueryRepository} from "../blogs-query.repository";

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithBody } from '../../../types/common'

export const createBlogController = async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
    const newBlog = await blogsRepository.create(req.body)

    if (!newBlog) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(newBlog)
}