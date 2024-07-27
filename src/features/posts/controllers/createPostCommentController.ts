import { Response } from 'express'

import {postsService} from "../domain/posts-service";

import {postsQueryRepository} from "../postsQueryRepository";

import {HTTP_STATUSES} from "../../../utils";

import { RequestAuthModelWithParamsAndBody} from "../../../types";

export const createPostCommentController = async (req: RequestAuthModelWithParamsAndBody<{ postId: string }, { content: string }>, res: Response) => {
    const existedCommentsLength = await postsQueryRepository.getPostsCommentsLength(req.params.postId)
    console.log(existedCommentsLength)
    if (existedCommentsLength > 0) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    console.log(req.user)
    return res.sendStatus(200)
    // const newComment = await postsService.createPostComment(req.params.postId, req.body.content, req.user!)
    //
    // return res.sendStatus(HTTP_STATUSES.CREATED_201).json(newComment)
}