import {Router} from 'express'

import {createPostController} from './controllers/createPostController'
import {getPostsController} from './controllers/getPostsController'
import {findPostController} from './controllers/findPostController'
import {delPostController} from './controllers/delPostController'
import {putPostController} from './controllers/putPostController'
import {createPostCommentController} from "./controllers/createPostCommentController";
import {getPostCommentsController} from "./controllers/getPostCommentsController";

import {
    findPostValidator,
    postValidators, putValidators,
} from './middlewares/postValidators'
import {postCommentValidator, findPostsValidator} from "./middlewares/postCommentValidators";

import {adminMiddleware} from '../../global-middlewares/admin-middleware'

export const postsRouter = Router()

postsRouter.post('/', ...postValidators, createPostController)
postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostValidator, findPostController)
postsRouter.delete('/:id', adminMiddleware, findPostValidator, delPostController)
postsRouter.put('/:id', ...putValidators, putPostController)
postsRouter.post('/:postId/comments', ...postCommentValidator, createPostCommentController)
postsRouter.get('/:postId/comments', findPostsValidator, getPostCommentsController)