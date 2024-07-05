import {body} from 'express-validator'
import {inputCheckErrorsMiddleware} from '../../../global-middlewares/inputCheckErrorsMiddleware'
import {blogsRepository} from '../../blogs/blogsRepository'
import {NextFunction, Response} from 'express'
import {postsRepository} from '../postsRepository'
import {adminMiddleware} from '../../../global-middlewares/admin-middleware'
import { RequestWithParams } from '../../../types'

// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid

export const titleValidator = body('title').trim().isString().isLength({ min: 3, max: 30 }).withMessage('title')
export const shortDescriptionValidator = body('shortDescription').isString().isLength({ min: 3, max: 100 }).withMessage('shortDescription')
export const contentValidator = body('content').trim().isString().isLength({ min: 3, max: 1000 }).withMessage('not string')
    .trim().isLength({min: 1, max: 1000}).withMessage('more then 1000 or 0')
export const blogIdValidator = body('blogId').isString().withMessage('not string')
    .trim().custom(async blogId => {
        const blog = await blogsRepository.find(blogId)
        if (!blog) {
            return Promise.reject()
        }
    }).withMessage('no blog')
export const findPostValidator = async (req: RequestWithParams<{ id: string }>, res: Response, next: NextFunction) => {
    const post = await postsRepository.find(req.params.id)
    console.log(post)
    if (!post) {
        res
            .status(404)
            .json({})
        return
    }

    next()
}

export const putValidators = [
    adminMiddleware, titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, findPostValidator, inputCheckErrorsMiddleware
]

export const postValidators = [
    adminMiddleware,
    blogIdValidator,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,

    inputCheckErrorsMiddleware,
]