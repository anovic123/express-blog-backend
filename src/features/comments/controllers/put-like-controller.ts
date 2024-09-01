import { Response } from 'express'

import {commentsService} from "../composition-root";

import {RequestCommentModelWithParams, RequestCommentModelWithParamsAndBody} from "../../../core/request-types";

import {HTTP_STATUSES} from "../../../utils";

export const PutLikeController = async (req: RequestCommentModelWithParamsAndBody<{ commentId: string }, { likeStatus: 'None' | 'Like' | 'Dislike' }>, res: Response) => {
    try {
        const comment = req.comment!

        await commentsService.likeComment(req.params.commentId, comment, req.body.likeStatus)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('error in the PutLikeController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}