import {body, validationResult} from 'express-validator'
import {inputCheckErrorsMiddleware} from '../../../global-middlewares/inputCheckErrorsMiddleware'
import {NextFunction, Request, Response} from 'express'
import {blogsRepository} from '../blogsRepository'
import {adminMiddleware} from '../../../global-middlewares/admin-middleware'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithParams } from '../../../types'

// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

export const nameValidator = body('name').trim().isLength({ min: 3, max: 15 }).isString().withMessage('name')
export const descriptionValidator = body('description').isString().withMessage('not string')
    .trim().isLength({min: 1, max: 500}).withMessage('more then 500 or 0')
export const websiteUrlValidator = body('websiteUrl').isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({min: 1, max: 100}).withMessage('more then 100 or 0')

export const findBlogValidator = (req: RequestWithParams<{ id: string }>, res: Response, next: NextFunction) => {
    body('id').isString().withMessage('not id')
    const errors = validationResult(req)
    const findExistedBlog = blogsRepository.find(req.params.id)
    if (!req.params.id || !findExistedBlog) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({ messages: errors.array() })
        return
    }

    next()
}

export const blogValidators = [
    adminMiddleware,

    nameValidator,
    descriptionValidator,
    websiteUrlValidator,

    inputCheckErrorsMiddleware,
]