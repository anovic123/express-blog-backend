import { Router } from 'express'

import {
    blogValidators,
    createBlogPostValidator,
    findBlogPostValidator,
    findBlogValidator
} from "./middlewares/blog.validators";

import {adminMiddleware} from "../../middlewares/admin.middleware";

import { container } from './composition-root';

import { BlogsController } from './controllers/blogs.controller';

export const blogsController = container.resolve<BlogsController>(BlogsController)

export const blogsRouter = Router()

blogsRouter.post('/', ...blogValidators, blogsController.createBlog.bind(blogsController))
blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id', findBlogValidator, blogsController.findBlog.bind(blogsController))
blogsRouter.delete('/:id', adminMiddleware, blogsController.deleteBlog.bind(blogsController))
blogsRouter.put('/:id', findBlogValidator, ...blogValidators, blogsController.putBlogs.bind(blogsController))
blogsRouter.post('/:blogId/posts', ...createBlogPostValidator, blogsController.createBlogsPost.bind(blogsController))
blogsRouter.get('/:blogId/posts', findBlogPostValidator, blogsController.getBlogPosts.bind(blogsController))