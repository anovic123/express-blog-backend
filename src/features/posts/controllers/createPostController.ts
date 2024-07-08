import {Response, Request} from 'express'
import {PostInputModel, PostViewModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithBody } from '../../../types'

export const createPostController = (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {
    const newPostId = postsRepository.create(req.body)
    const newPost = postsRepository.findAndMap(newPostId)

    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(newPost)
}