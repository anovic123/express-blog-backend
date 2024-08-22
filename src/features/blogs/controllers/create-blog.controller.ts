import {Response} from 'express'

import {BlogInputModel, BlogViewModel} from '../../../types/blogs-types'

import {blogsService} from "../domain/blogs.service";

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithBody } from '../../../types/common'

export const createBlogController = async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
    try {
        const newBlog = await blogsService.createBlog(req.body)
    
        if (!newBlog) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }
    
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(newBlog)
    } catch (error) {
        console.error('createBlogController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}