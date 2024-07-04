import {Request, Response} from 'express'
import {PostViewModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'
import { HTTP_STATUSES } from '../../../utils'

export const getPostsController = async (req: Request, res: Response<PostViewModel[]>) => {
    const posts = await postsRepository.getAll()

    return res.status(HTTP_STATUSES.OKK_200).json(posts)
}