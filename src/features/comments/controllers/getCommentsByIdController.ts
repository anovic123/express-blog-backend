import { Response } from "express";
import {RequestAuthModel} from "../../../types";
import {commentsQueryRepository} from "../commentsQueryRepository";
import {HTTP_STATUSES} from "../../../utils";

export const getCommentsByIdController = async (req: RequestAuthModel, res: Response) => {
    const commentsRes = await commentsQueryRepository.getCommentsById(req.params.id)

    if (!commentsRes) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.status(HTTP_STATUSES.OKK_200).send(commentsRes)
}