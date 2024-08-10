import {NextFunction, Response} from 'express'
import { body, validationResult } from 'express-validator'

import {inputCheckErrorsMiddleware} from '../../../global-middlewares/input-check-errors.middleware'
import {adminMiddleware} from '../../../global-middlewares/admin.middleware'

import {blogsQueryRepository} from "../blogs-query.repository";

import { HTTP_STATUSES } from '../../../utils'

import { RequestWithParams } from '../../../types/common'

export const nameValidator = body('name').trim().isLength({ min: 3, max: 15 }).isString().withMessage('name')
export const descriptionValidator = body('description').isString().withMessage('not string')
    .trim().isLength({min: 1, max: 500}).withMessage('more then 500 or 0')
export const websiteUrlValidator = body('websiteUrl').isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({min: 1, max: 100}).withMessage('more then 100 or 0')

export const findBlogValidator = async (req: RequestWithParams<{ id: string }>, res: Response, next: NextFunction) => {
    body('id').isString().withMessage('not id')
    const errors = validationResult(req)
    const findExistedBlog = await blogsQueryRepository.findBlog(req.params.id)
    if (!req.params.id || !findExistedBlog) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({ messages: errors.array() })
        return
    }

    next()
}

export const findBlogPostValidator = async (req: RequestWithParams<{ blogId: string }>, res: Response, next: NextFunction) => {
    body('blogId').isString().withMessage('not id')
    const errors = validationResult(req)
    const findExistedBlog = await blogsQueryRepository.findBlog(req.params.blogId)
    if (!req.params.blogId || !findExistedBlog) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({ messages: errors.array() })
        return
    }

    next()
}

/**
 * create blog post validator
 * * */
// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000

const titleValidator = body('title').isString().trim().isLength({ min: 3, max: 30 }).withMessage('title')
const shortDescriptionValidator = body('shortDescription').isString().trim().isLength({ min: 3, max: 100 }).withMessage('shortDescription')
const contentValidator = body('content').isString().trim().isLength({ min: 3, max: 1000 }).withMessage('content')

export const createBlogPostValidator = [
    adminMiddleware,

    findBlogPostValidator,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,

    inputCheckErrorsMiddleware
]

export const blogValidators = [
    adminMiddleware,

    nameValidator,
    descriptionValidator,
    websiteUrlValidator,

    inputCheckErrorsMiddleware,
]