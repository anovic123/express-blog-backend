import {Response} from 'express'

import {PostInputModel, PostViewModel} from '../../../types/posts-types'

import {postsService} from "../application/posts.service";

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithBody } from '../../../types/common'

export const createPostController = async (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {

    try {
        const newPost = await postsService.createPost(req.body)

        if (!newPost) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(newPost)
    } catch (error) {
        console.error('createPostController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}