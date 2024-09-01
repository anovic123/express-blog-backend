import { Response} from 'express'

import { HTTP_STATUSES } from '../../../utils'

import {RequestWithParamsAndBody} from "../../../core/request-types";

import {blogsService} from "../composition-root";

import {BlogInputModel} from "../dto/input";

export const putBlogController = async (req: RequestWithParamsAndBody<{id: string}, BlogInputModel>, res: Response) => {

    const updateBlog = await blogsService.updateBlog(req.body, req.params.id)

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