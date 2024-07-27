import {body} from "express-validator";
import {authMiddleware} from "../../../global-middlewares/auth-middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/inputCheckErrorsMiddleware";
import {RequestWithParams} from "../../../types";
import {NextFunction, Response} from "express";
import {postsRepository} from "../../posts/postsRepository";

const contentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 })

export const findPostsValidator = async (req: RequestWithParams<{ commentId: string }>, res: Response, next: NextFunction) => {
    const post = await postsRepository.find(req.params.commentId)
    console.log(post)
    if (!post) {
        res
            .status(404)
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