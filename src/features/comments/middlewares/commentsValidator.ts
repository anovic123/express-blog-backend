import {body, param} from "express-validator";
import {authMiddleware} from "../../../global-middlewares/auth-middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/inputCheckErrorsMiddleware";
import {RequestWithParams} from "../../../types";
import {NextFunction, Response} from "express";
import {postsRepository} from "../../posts/postsRepository";
import {HTTP_STATUSES} from "../../../utils";
import {commentsRepository} from "../commentsRepository";
import {commentsQueryRepository} from "../commentsQueryRepository";

const contentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findCommentsValidator = async (req: RequestWithParams<{ commentId: string }>, res: Response, next: NextFunction) => {
    if (!req.params.commentId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const comment = await commentsQueryRepository.getCommentsById(req.params.commentId)

    if (!comment) {
        res.status(HTTP_STATUSES.NOT_FOUND_404)
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