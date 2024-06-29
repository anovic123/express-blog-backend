import {Request, Response} from 'express'
import {PostViewModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithParams } from '../../../types'

export const findPostController = (req: RequestWithParams<{id: string}>, res: Response<PostViewModel | {}>) => {
    const blogById = postsRepository.findAndMap(req.params.id)

    return res.status(HTTP_STATUSES.OKK_200).json(blogById)
}