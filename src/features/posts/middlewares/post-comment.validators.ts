import {NextFunction, Response} from "express";

import {body} from "express-validator";

import {inputCheckErrorsMiddleware} from "../../../global-middlewares/input-checks-errors.middleware";

import {authMiddleware} from "../../../global-middlewares/auth.middleware";

import {postsQueryRepository} from "../composition-root";

import {RequestWithParams} from "../../../core/request-types";

export const contentCommentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findPostsValidator = async (req: RequestWithParams<{ postId: string }>, res: Response, next: NextFunction) => {
    const post = await postsQueryRepository.findPost(req.params.postId)
    if (!post) {
        res
            .sendStatus(404)
        return
    }

    next()
}

export const postCommentValidator = [
    authMiddleware, findPostsValidator, contentCommentValidator, inputCheckErrorsMiddleware
]