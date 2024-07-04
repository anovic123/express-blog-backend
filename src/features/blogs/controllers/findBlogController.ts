import { Response} from 'express'
import {BlogViewModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithParams } from '../../../types'

export const findBlogController = async (req: RequestWithParams<{id: string}>, res: Response<BlogViewModel | {}>) => {
    const blogById = await blogsRepository.find(req.params.id)

    if (!blogById) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    return res.json(blogById)
}