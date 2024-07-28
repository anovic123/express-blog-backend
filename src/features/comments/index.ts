import { Router } from 'express'

import {getCommentsByIdController} from "./controllers/getCommentsByIdController";
import {putCommentController} from "./controllers/putCommentController";
import {deleteCommentController} from "./controllers/deleteCommentController";

import {deleteCommentValidator, putCommentValidator} from "./middlewares/commentsValidator";

export const commentsRouter = Router()

commentsRouter.get('/:commentId', getCommentsByIdController)
commentsRouter.put('/:commentId', ...putCommentValidator, putCommentController)
commentsRouter.delete('/:commentId', ...deleteCommentValidator, deleteCommentController)