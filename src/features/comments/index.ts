import { Router } from 'express'
import {getCommentsByIdController} from "./controllers/getCommentsByIdController";
import {putCommentController} from "./controllers/putCommentController";
import {putCommentValidator} from "./middlewares/putCommentValidator";

export const commentsRouter = Router()

commentsRouter.get('/:commentId', getCommentsByIdController)
commentsRouter.put('/:commentId', ...putCommentValidator, putCommentController)