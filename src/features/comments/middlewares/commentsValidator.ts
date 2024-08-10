import {NextFunction, Response} from "express";
import {body, param} from "express-validator";

import {authMiddleware} from "../../../global-middlewares/auth-middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/inputCheckErrorsMiddleware";

import {commentsQueryRepository} from "../commentsQueryRepository";

import {HTTP_STATUSES} from "../../../utils";

import {RequestWithParams} from "../../../types/common";


const contentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findCommentsValidator = async (req: RequestWithParams<{ commentId: string }>, res: Response, next: NextFunction) => {
    if (!req.params.commentId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const comment = await commentsQueryRepository.getCommentById(req.params.commentId)

    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

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