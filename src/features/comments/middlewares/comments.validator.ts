import { Types, ObjectId } from "mongoose";
import {NextFunction, Response} from "express";
import {body, param} from "express-validator";

import { commentsQueryRepository } from "../infra/comments-query.repository";

import {AuthMiddleware, container} from "../../../middlewares/auth.middleware";
import {inputCheckErrorsMiddleware} from "../../../middlewares/input-checks-errors.middleware";

import {HTTP_STATUSES} from "../../../utils";

import { LikeStatus } from "../domain/like.entity";

const contentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findCommentsValidator = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    if (!req.params.commentId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const comment = await commentsQueryRepository.getCommentById(req.params.commentId, new Types.ObjectId(req.user._id).toString())

    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    req.likesInfo = {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: comment.likesInfo.myStatus
    } as any
    next()
}

const authMiddleware = container.get(AuthMiddleware);

export const putCommentValidator = [
    authMiddleware.use.bind(authMiddleware),
    findCommentsValidator,
    contentValidator,
    inputCheckErrorsMiddleware
]

const commentIdValidator = param('commentId').isString().trim()

export const deleteCommentValidator = [
    authMiddleware.use.bind(authMiddleware),
    commentIdValidator,
    findCommentsValidator,
    inputCheckErrorsMiddleware
]

const likeStatusValidator = body('likeStatus')
    .isString()
    .isIn(Object.values(LikeStatus))

export const putLikeCommentValidator = [
    authMiddleware.use.bind(authMiddleware),
    likeStatusValidator,
    findCommentsValidator,
    inputCheckErrorsMiddleware
]