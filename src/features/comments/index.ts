import { Router } from 'express'

import {deleteCommentValidator, putCommentValidator, putLikeCommentValidator} from "./middlewares/comments.validator";

import {getCommentsByIdController} from "./controllers/get-comments-by-id.controller";
import {putCommentController} from "./controllers/put-comment.controller";
import {deleteCommentController} from "./controllers/delete-comment.controller";

export const commentsRouter = Router()

commentsRouter.get('/:commentId', getCommentsByIdController)
commentsRouter.put('/:commentId', ...putCommentValidator, putCommentController)
commentsRouter.delete('/:commentId', ...deleteCommentValidator, deleteCommentController)
commentsRouter.put('/:commentId/like-status', ...putLikeCommentValidator)