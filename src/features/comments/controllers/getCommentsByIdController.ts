import { Response } from "express";
import { RequestAuthModelWithParams } from "../../../types";
import {commentsQueryRepository} from "../commentsQueryRepository";
import {HTTP_STATUSES} from "../../../utils";

export const getCommentsByIdController = async (req: RequestAuthModelWithParams<{ commentId: string }>, res: Response) => {
    const commentsRes = await commentsQueryRepository.getCommentsById(req.params.commentId)
    if (commentsRes.length === 0) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.status(HTTP_STATUSES.OKK_200).send(commentsRes)
}