import { Router } from 'express'

import {deleteCommentValidator, findCommentsValidator, putCommentValidator, putLikeCommentValidator} from "./middlewares/comments.validator";

import { container } from './composition-root';

import { CommentsController } from './controllers/comments.controller';

export const commentsController = container.resolve<CommentsController>(CommentsController)

export const commentsRouter = Router()

commentsRouter.get('/:commentId', commentsController.getCommentsById.bind(commentsController))
commentsRouter.put('/:commentId', ...putCommentValidator, commentsController.putComment.bind(commentsController))
commentsRouter.delete('/:commentId', ...deleteCommentValidator, commentsController.deleteComment.bind(commentsController))
commentsRouter.put('/:commentId/like-status', ...putLikeCommentValidator, commentsController.putLike.bind(commentsController))
