import { Router } from 'express'

import {adminMiddleware} from "../../middlewares/admin.middleware";

import {findPostValidator, postValidators, putValidators} from "./middlewares/post.validator";
import {findPostsValidator, postCommentValidator, putLikeStatusValidator} from "./middlewares/post-comment.validators";

import { PostsController } from './controllers/posts.controller';

import { container } from './composition-root';

export const postsController = container.resolve<PostsController>(PostsController)

export const postsRouter = Router({})

postsRouter.post('/', ...postValidators, postsController.createPost.bind(postsController))
postsRouter.get('/', postsController.getPosts.bind(postsController))
postsRouter.get('/:id', postsController.findPost.bind(postsController))
postsRouter.delete('/:id', adminMiddleware, findPostValidator, postsController.deletePost.bind(postsController))
postsRouter.put('/:id', ...putValidators, postsController.putPosts.bind(postsController))
postsRouter.post('/:postId/comments', ...postCommentValidator, postsController.createPostComment.bind(postsController))
postsRouter.get('/:postId/comments', findPostsValidator, postsController.getPostsComments.bind(postsController))
postsRouter.put('/:postId/like-status', ...putLikeStatusValidator, postsController.putPostLike.bind(postsController))
