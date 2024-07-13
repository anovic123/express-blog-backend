import {Request, Response} from 'express'
import {PostViewModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'
import { HTTP_STATUSES } from '../../../utils'
import {helper} from "../helper";

export const getPostsController = async (req: Request, res: Response<any>) => {

    const sanitizedQuery = helper(req.query as { [key: string]: string | undefined })
    const posts = await postsRepository.getAll(sanitizedQuery, req.params.id)

    return res.status(HTTP_STATUSES.OKK_200).json(posts)
}