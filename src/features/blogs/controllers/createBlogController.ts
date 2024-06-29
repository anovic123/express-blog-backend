import {Response} from 'express'
import {BlogInputModel, BlogViewModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithBody } from '../../../types'

export const createBlogController = (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
    const newBlogId = blogsRepository.create(req.body)
    const newBlog = blogsRepository.findAndMap(newBlogId)

    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(newBlog)
}