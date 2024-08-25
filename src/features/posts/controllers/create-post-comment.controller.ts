import { Response } from 'express'
import { ObjectId } from 'mongodb'

import {postsQueryRepository} from "../infra/posts-query.repository";

import {postsService} from "../application/posts.service";

import {HTTP_STATUSES} from "../../../utils";

import { RequestAuthModelWithParamsAndBody} from "../../../types/common";

export const createPostCommentController = async (req: RequestAuthModelWithParamsAndBody<{ postId: string }, { content: string }>, res: Response) => {
    const postId = new ObjectId(req.params.postId);

    if (!ObjectId.isValid(postId)) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    try {
        const existedPost = await postsQueryRepository.findPostsAndMap(req.params.postId)
        if (!existedPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const newComment = await postsService.createPostComment(req.params.postId, req.body.content, req.user!)

        res.status(HTTP_STATUSES.CREATED_201).json(newComment)
    } catch (error) {
        console.error('createPostCommentController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}