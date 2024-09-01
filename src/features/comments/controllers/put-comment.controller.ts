import { Response } from 'express'

import {RequestAuthModelWithParams} from "../../../core/request-types";

import {commentsQueryRepository, commentsService} from "../composition-root";

import {HTTP_STATUSES} from "../../../utils";

export const putCommentController = async (req: RequestAuthModelWithParams<{ commentId: string }>, res: Response) => {
    try {
        const isOwn = await commentsQueryRepository.checkIsOwn(req.params.commentId, req.user!)

        if (!isOwn) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN)
            return
        }

        const updatedComment = await commentsService.updateComment(req.params.commentId, req.body.content)

        res.sendStatus(HTTP_STATUSES.OKK_200)
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}