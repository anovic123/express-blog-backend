import { Response} from 'express'

import {blogsQueryRepository} from "../blogs-query.repository";

import {BlogViewModel} from '../../../types/blogs-types'

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithParams } from '../../../types/common'

export const findBlogController = async (req: RequestWithParams<{id: string}>, res: Response<BlogViewModel | {}>) => {
    try {
        const blogById = await blogsQueryRepository.findBlog(req.params.id)
    
        if (!blogById) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
    
        res.json(blogById)
    } catch (error) {
        console.error('findBlogController', error)
    }
}