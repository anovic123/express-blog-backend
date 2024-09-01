import {NextFunction, Response} from "express";
import {body, param} from "express-validator";

import {commentsQueryRepository} from "../composition-root";

import {authMiddleware} from "../../../global-middlewares/auth.middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/input-checks-errors.middleware";

import {HTTP_STATUSES} from "../../../utils";

import {RequestCommentModelWithParams} from "../../../core/request-types";

const contentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findCommentsValidator = async (req: RequestCommentModelWithParams<{ commentId: string }>, res: Response, next: NextFunction) => {
    if (!req.params.commentId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const comment = await commentsQueryRepository.getCommentById(req.params.commentId)

    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    req.comment = comment
    next()
}

export const putCommentValidator = [
    authMiddleware,
    findCommentsValidator,
    contentValidator,
    inputCheckErrorsMiddleware
]

const commentIdValidator = param('commentId').isString().trim()

export const deleteCommentValidator = [
    authMiddleware,
    commentIdValidator,
    findCommentsValidator,
    inputCheckErrorsMiddleware
]

export const putLikeCommentValidator = [
    authMiddleware,
    findCommentsValidator
]