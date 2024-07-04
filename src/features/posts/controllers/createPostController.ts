import {Response, Request} from 'express'
import {PostInputModel, PostViewModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithBody } from '../../../types'

export const createPostController = async (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {
    const newPostId = await postsRepository.create(req.body)

    if (!newPostId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const newPost = await postsRepository.findAndMap(newPostId)

    if (!newPost) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    return res
        .status(HTTP_STATUSES.CREATED_201)
        .json(newPost)
}