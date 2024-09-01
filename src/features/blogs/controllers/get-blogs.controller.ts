import { Response } from 'express'

import { HTTP_STATUSES } from '../../../utils'

import { getAllBlogsHelperResult} from "../helper";

import {RequestWithQueryAndParams} from "../../../core/request-types";

import {blogsQueryRepository} from "../composition-root";

export const getBlogsController = async (req: RequestWithQueryAndParams<getAllBlogsHelperResult, { id: string }>, res: Response) => {
    try {
        const blogs = await blogsQueryRepository.getAllBlogs(req.query, req.params.id)

        res.status(HTTP_STATUSES.OKK_200).json(blogs)
    } catch (error) {
        console.error('getBlogsController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}