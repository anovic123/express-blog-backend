import { Response} from 'express'

import { BlogInputModel } from '../../../types/blogs-types'

import { blogsRepository } from '../blogs.repository'

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithParamsAndBody } from '../../../types/common'

export const putBlogController = async (req: RequestWithParamsAndBody<{id: string}, BlogInputModel>, res: Response) => {

    const updateBlog = await blogsRepository.updateBlog(req.body, req.params.id)

    if (!updateBlog) {
        return res.status(HTTP_STATUSES.NOT_FOUND_404).json({
            errorsMessages: [
                {
                    message: 'Update blog',
                    field: 'Something went wrong'
                }
            ]
        })
    }
    
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}