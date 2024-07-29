import {body} from "express-validator";
import {RequestWithParams} from "../../../types/common";
import {NextFunction, Response} from "express";
import {postsRepository} from "../postsRepository";
import {authMiddleware} from "../../../global-middlewares/auth-middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/inputCheckErrorsMiddleware";
import {postsQueryRepository} from "../postsQueryRepository";

export const contentCommentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findPostsValidator = async (req: RequestWithParams<{ postId: string }>, res: Response, next: NextFunction) => {
    const post = await postsQueryRepository.find(req.params.postId)
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