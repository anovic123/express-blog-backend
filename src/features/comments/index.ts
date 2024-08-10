import { Router } from 'express'

import {getCommentsByIdController} from "./controllers/get-comments-by-id.controller";
import {putCommentController} from "./controllers/put-comment.controller";
import {deleteCommentController} from "./controllers/delete-comment.controller";

import {deleteCommentValidator, putCommentValidator} from "./middlewares/comments.validators";

export const commentsRouter = Router()

commentsRouter.get('/:commentId', getCommentsByIdController)
commentsRouter.put('/:commentId', ...putCommentValidator, putCommentController)
commentsRouter.delete('/:commentId', ...deleteCommentValidator, deleteCommentController)