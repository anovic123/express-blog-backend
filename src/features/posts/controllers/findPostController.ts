import {Request, Response} from 'express'
import {PostViewModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithParams } from '../../../types'

export const findPostController = async (req: RequestWithParams<{id: string}>, res: Response<PostViewModel | {}>) => {
    const blogById = await postsRepository.findAndMap(req.params.id)

    if (!blogById) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    } else {
        res.status(HTTP_STATUSES.OKK_200).json(blogById)
        return
    }
}