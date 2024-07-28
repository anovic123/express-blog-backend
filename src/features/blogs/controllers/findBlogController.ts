import { Response} from 'express'

import {blogsQueryRepository} from "../blogsQueryRepository";

import {BlogViewModel} from '../../../input-output-types/blogs-types'

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithParams } from '../../../types'

export const findBlogController = async (req: RequestWithParams<{id: string}>, res: Response<BlogViewModel | {}>) => {
    const blogById = await blogsQueryRepository.findBlog(req.params.id)

    if (!blogById) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    return res.json(blogById)
}