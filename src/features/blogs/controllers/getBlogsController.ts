import {Request, Response} from 'express'
import {BlogViewModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'
import { HTTP_STATUSES } from '../../../utils'

export const getBlogsController = async (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs = await blogsRepository.getAll()

    return res.status(HTTP_STATUSES.OKK_200).json(blogs)
}