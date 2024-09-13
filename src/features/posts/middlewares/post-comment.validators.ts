import { Types } from "mongoose";
import {NextFunction, Response} from "express";

import {body} from "express-validator";

import {inputCheckErrorsMiddleware} from "../../../middlewares/input-checks-errors.middleware";

import {AuthMiddleware, container} from "../../../middlewares/auth.middleware";

import { postsQueryRepository } from "../infra/posts-query.repository";

import {RequestUserStatusPostModelWithParams, RequestWithParams} from "../../../core/request-types";
import { LikePostStatus } from "../domain/post-like.entity";

export const contentCommentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findPostsValidator = async (req: RequestUserStatusPostModelWithParams<{ postId: string }>, res: Response, next: NextFunction) => {
    const post = await postsQueryRepository.findPostsAndMap(req.params.postId, new Types.ObjectId(req?.user?._id).toString())
    if (!post) {
        res
            .sendStatus(404)
        return
    }

    req.likesInfo = {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: post.extendedLikesInfo.myStatus,
        newestLikes: post.extendedLikesInfo.newestLikes
    }
    next()
}

const authMiddleware = container.get(AuthMiddleware);

export const postCommentValidator = [
    authMiddleware.use.bind(authMiddleware), findPostsValidator, contentCommentValidator, inputCheckErrorsMiddleware
]

const likeStatusValidator = body('likeStatus')
.isString()
.isIn(Object.values(LikePostStatus))

export const putLikeStatusValidator = [
    authMiddleware.use.bind(authMiddleware),
    findPostsValidator,
    likeStatusValidator,
    inputCheckErrorsMiddleware
]