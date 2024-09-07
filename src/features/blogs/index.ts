import { Router } from 'express'

import {
    blogValidators,
    createBlogPostValidator,
    findBlogPostValidator,
    findBlogValidator
} from "./middlewares/blog.validators";

import {adminMiddleware} from "../../middlewares/admin.middleware";

import {createBlogController} from "./controllers/create-blog.controller";
import {getBlogsController} from "./controllers/get-blogs.controller";
import {findBlogController} from "./controllers/find-blog.controller";
import {deleteBlogController} from "./controllers/delete-blog.controller";
import {putBlogController} from "./controllers/put-blogs.controller";
import {createBlogPostController} from "./controllers/create-blog-post.controller";
import {getBlogPostsController} from "./controllers/get-blog-posts.controller";

export const blogsRouter = Router()

blogsRouter.post('/', ...blogValidators, createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogValidator, findBlogController)
blogsRouter.delete('/:id', adminMiddleware, deleteBlogController)
blogsRouter.put('/:id', findBlogValidator, ...blogValidators, putBlogController)
blogsRouter.post('/:blogId/posts', ...createBlogPostValidator, createBlogPostController)
blogsRouter.get('/:blogId/posts', findBlogPostValidator, getBlogPostsController)