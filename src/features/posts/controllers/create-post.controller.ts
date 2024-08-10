import {Response} from 'express'

import {PostInputModel, PostViewModel} from '../../../types/posts-types'

import {postsService} from "../domain/posts.service";

import {postsQueryRepository} from "../posts-query.repository";

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithBody } from '../../../types/common'

export const createPostController = async (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {
    const newPostId = await postsService.createPost(req.body)

    if (!newPostId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const newPost = await postsQueryRepository.getMappedPostById(newPostId)

    if (!newPost) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    return res
        .status(HTTP_STATUSES.CREATED_201)
        .json(newPost)
}