import {body} from "express-validator";
import {RequestWithParams} from "../../../types";
import {NextFunction, Response} from "express";
import {postsRepository} from "../postsRepository";
import {authMiddleware} from "../../../global-middlewares/auth-middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/inputCheckErrorsMiddleware";

export const contentCommentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findPostsValidator = async (req: RequestWithParams<{ postId: string }>, res: Response, next: NextFunction) => {
    const post = await postsRepository.find(req.params.postId)
    if (!post) {
        res
            .status(404)
            .json({})
        return
    }

    next()
}

export const postCommentValidator = [
    authMiddleware, findPostsValidator, contentCommentValidator, inputCheckErrorsMiddleware
]