import { Response } from 'express'

import {commentsQueryRepository, commentsService} from "../composition-root";

import {RequestAuthModelWithParams} from "../../../core/request-types";

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