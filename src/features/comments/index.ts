import { Router, Request, Response } from 'express'

import {deleteCommentValidator, findCommentsValidator, putCommentValidator, putLikeCommentValidator} from "./middlewares/comments.validator";

import {getCommentsByIdController} from "./controllers/get-comments-by-id.controller";
import {putCommentController} from "./controllers/put-comment.controller";
import {deleteCommentController} from "./controllers/delete-comment.controller";
import {putLikeController} from "./controllers/put-like-controller";
import { commentsRepository } from './composition-root';

export const commentsRouter = Router()

commentsRouter.get('/:commentId', getCommentsByIdController)
commentsRouter.put('/:commentId', ...putCommentValidator, putCommentController)
commentsRouter.delete('/:commentId', ...deleteCommentValidator, deleteCommentController)
commentsRouter.put('/:commentId/like-status', ...putLikeCommentValidator, putLikeController)

//========================================================================================================================================================

commentsRouter.post('/clear-likes', async (req: Request, res: Response) => {
  try {
   await commentsRepository.deleteAllLikes()
   res.sendStatus(200)
  } catch (error) {
    console.error(error)
  }
})