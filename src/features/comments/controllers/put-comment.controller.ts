import { Response } from 'express';

import {commentsQueryRepository, commentsService} from "../composition-root";

import {RequestAuthModelWithParamsAndBody} from "../../../core/request-types";

import { HTTP_STATUSES } from "../../../utils";

export const putCommentController = async (req: RequestAuthModelWithParamsAndBody<{ commentId: string }, { content: string }>, res: Response) => {
    const isOwn = await commentsQueryRepository.checkIsOwn(req.params.commentId, req.user!)

    if (!isOwn) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN)
        return
    }

    const updatedComment = await commentsService.updateComment(req.params.commentId, req.body.content)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}
