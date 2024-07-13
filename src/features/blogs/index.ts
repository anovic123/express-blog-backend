import {Router} from 'express'
import {createBlogController} from './controllers/createBlogController'
import {getBlogsController} from './controllers/getBlogsController'
import {findBlogController} from './controllers/findBlogController'
import {delBlogController} from './controllers/delBlogController'
import {putBlogController} from './controllers/putBlogController'
import {
    blogValidators,
    createBlogPostValidator,
    findBlogPostValidator,
    findBlogValidator
} from './middlewares/blogValidators'
import {adminMiddleware} from '../../global-middlewares/admin-middleware'
import {createBlogPostController} from "./controllers/createBlogPostController";
import {getBlogPostsController} from "./controllers/getBlogPostsController";

export const blogsRouter = Router()

blogsRouter.post('/', ...blogValidators, createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogValidator, findBlogController)
blogsRouter.delete('/:id', adminMiddleware, delBlogController)
blogsRouter.put('/:id', findBlogValidator, ...blogValidators, putBlogController)
blogsRouter.post('/:blogId/posts', ...createBlogPostValidator, createBlogPostController)
blogsRouter.get('/:blogId/posts', findBlogPostValidator, getBlogPostsController)