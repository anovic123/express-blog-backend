import { Response} from 'express'
import { BlogInputModel } from '../../../input-output-types/blogs-types'
import { blogsRepository } from '../blogsRepository'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithParamsAndBody } from '../../../types'

export const putBlogController = async (req: RequestWithParamsAndBody<{id: string}, BlogInputModel>, res: Response) => {

    const updateBlog = await blogsRepository.put(req.body, req.params.id)

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