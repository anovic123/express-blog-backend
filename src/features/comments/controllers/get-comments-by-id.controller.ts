import { Response } from "express";

import {commentsQueryRepository} from "../composition-root";

import {RequestWithParams} from "../../../core/request-types";
import {jwtService} from "../../../core/services/jwt.service";

import {HTTP_STATUSES} from "../../../utils";

export const getCommentsByIdController = async (req: RequestWithParams<{ commentId: string }>, res: Response) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        let accessTokenUserId
        if (accessToken) {
            accessTokenUserId = await jwtService.getUserIdByToken(accessToken!);
        }

        const commentsRes = await commentsQueryRepository.getCommentById(req.params.commentId, accessTokenUserId)
        if (!commentsRes) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.OKK_200).send(commentsRes)
    } catch (error) {
        console.error('getCommentsByIdController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}