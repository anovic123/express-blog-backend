import {Router} from 'express'
import {createBlogController} from './controllers/createBlogController'
import {getBlogsController} from './controllers/getBlogsController'
import {findBlogController} from './controllers/findBlogController'
import {delBlogController} from './controllers/delBlogController'
import {putBlogController} from './controllers/putBlogController'
import {blogValidators, createBlogPostValidator, findBlogValidator} from './middlewares/blogValidators'
import {adminMiddleware} from '../../global-middlewares/admin-middleware'
import {createBlogPostController} from "./controllers/createBlogPostController";

export const blogsRouter = Router()

blogsRouter.post('/', ...blogValidators, createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogValidator, findBlogController)
blogsRouter.delete('/:id', adminMiddleware, delBlogController)
blogsRouter.put('/:id', findBlogValidator, ...blogValidators, putBlogController)
blogsRouter.post('/:id/posts', ...createBlogPostValidator, createBlogPostController)