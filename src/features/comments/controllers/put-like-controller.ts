import { Response } from 'express';

import { commentsService } from "../composition-root";
import {
    RequestUserStatusCommentModelWithParams
} from "../../../core/request-types";
import { HTTP_STATUSES } from "../../../utils";
import { jwtService } from "../../../core/services/jwt.service";

export const putLikeController = async (
    req: RequestUserStatusCommentModelWithParams<{ commentId: string }>,
    res: Response
) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        
        const accessTokenUserId = await jwtService.getUserIdByToken(accessToken!);

        if (!accessTokenUserId) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return
        }

        const likeUpdated = await commentsService.likeComment(
            req.params.commentId,
            req.likesInfo!,
            req.body.likeStatus,
            accessTokenUserId
        );

        if (!likeUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (error) {
        console.error('Error in the PutLikeController', error);
        if (!res.headersSent) {
            res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }
    }
};
