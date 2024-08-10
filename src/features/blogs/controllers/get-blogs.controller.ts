import { Response } from 'express'

import {blogsQueryRepository} from "../blogs-query.repository";

import { HTTP_STATUSES } from '../../../utils'

import {getAllBlogsHelper, getAllBlogsHelperResult} from "../helper";

import { RequestWithQueryAndParams } from "../../../types/common";

export const getBlogsController = async (req: RequestWithQueryAndParams<getAllBlogsHelperResult, { id: string }>, res: Response<any>) => {
    const sanitizedQuery = getAllBlogsHelper(req.query as { [key: string]: string | undefined })
    const blogs = await blogsQueryRepository.getAllBlogs(sanitizedQuery, req.params.id)

    return res.status(HTTP_STATUSES.OKK_200).json(blogs)
}