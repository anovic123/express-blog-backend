import {Request, Response} from 'express'
import {BlogViewModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'

export const findBlogController = (req: Request<{id: string}>, res: Response<BlogViewModel | {}>) => {
    const blogById = blogsRepository.find(req.params.id)
    console.log(blogById)
    if (!blogById) {
        res.sendStatus(404)
        return
    }

    return res.json(blogById)
}