import {body, param} from "express-validator";
import {authMiddleware} from "../../../global-middlewares/auth-middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/inputCheckErrorsMiddleware";
import {RequestWithParams} from "../../../types";
import {NextFunction, Response} from "express";
import {postsRepository} from "../../posts/postsRepository";
import {HTTP_STATUSES} from "../../../utils";

const contentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findPostsValidator = async (req: RequestWithParams<{ commentId: string }>, res: Response, next: NextFunction) => {
    if (!req.params.commentId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const post = await postsRepository.find(req.params.commentId)
    console.log(post)
    if (!post) {
        res
            .status(HTTP_STATUSES.NOT_FOUND_404)
            .json({})
        return
    }

    next()
}

export const putCommentValidator = [
    authMiddleware,
    findPostsValidator,
    contentValidator,
    inputCheckErrorsMiddleware
]

const commentIdValidator = param('commentId').isString().trim()

export const deleteCommentValidator = [
    authMiddleware,
    commentIdValidator,
    findPostsValidator,
    inputCheckErrorsMiddleware
]