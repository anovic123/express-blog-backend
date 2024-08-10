import {Router} from 'express'

import {createPostController} from './controllers/create-post.controller'
import {getPostsController} from './controllers/get-posts.controller'
import {findPostController} from './controllers/find-post.controller'
import {deletePostController} from './controllers/delete-post.controller'
import {putPostController} from './controllers/put-post.controller'
import {createPostCommentController} from "./controllers/create-post-comment.controller";
import {getPostCommentsController} from "./controllers/get-post-comments.controller";

import {
    findPostValidator,
    postValidators, putValidators,
} from './middlewares/post.validators'
import {postCommentValidator, findPostsValidator} from "./middlewares/post-comment.validators";

import {adminMiddleware} from '../../global-middlewares/admin.middleware'

export const postsRouter = Router()

postsRouter.post('/', ...postValidators, createPostController)
postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.delete('/:id', adminMiddleware, findPostValidator, deletePostController)
postsRouter.put('/:id', ...putValidators, putPostController)
postsRouter.post('/:postId/comments', ...postCommentValidator, createPostCommentController)
postsRouter.get('/:postId/comments', findPostsValidator, getPostCommentsController)