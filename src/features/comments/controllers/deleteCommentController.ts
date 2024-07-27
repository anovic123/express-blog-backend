import { Response } from 'express'

import {commentsService} from "../domain/comments-service";

import {commentsQueryRepository} from "../commentsQueryRepository";

import {RequestAuthModelWithParams} from "../../../types";

import {HTTP_STATUSES} from "../../../utils";

export const deleteCommentController = async (req: RequestAuthModelWithParams<{ commentId: string }>, res: Response) => {
    const isOwn = await commentsQueryRepository.checkIsOwn(req.params.commentId, req.user!)

    if (!isOwn) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN)
        return
    }

    const deleteRes = await commentsService.deleteComment(req.params.commentId)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}