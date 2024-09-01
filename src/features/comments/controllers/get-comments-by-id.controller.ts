import { Response } from "express";

import {commentsQueryRepository} from "../composition-root";

import {RequestAuthModelWithParams} from "../../../core/request-types";

import {HTTP_STATUSES} from "../../../utils";

export const getCommentsByIdController = async (req: RequestAuthModelWithParams<{ commentId: string }>, res: Response) => {
    const commentsRes = await commentsQueryRepository.getCommentById(req.params.commentId)
    if (!commentsRes) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.status(HTTP_STATUSES.OKK_200).send(commentsRes)
}