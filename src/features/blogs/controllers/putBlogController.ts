import {Request, Response} from 'express'
import {BlogInputModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'

export const putBlogController = (req: Request<{id: string}, any, BlogInputModel>, res: Response) => {

    const updateBlog = blogsRepository.put(req.body, req.params.id)

    if (updateBlog) {
        res.sendStatus(204)
        return
    }

    return res.status(400).json({
        errorsMessages: [
            {
                message: 'Update blog',
                field: 'Something went wrong'
            }
        ]
    })
}