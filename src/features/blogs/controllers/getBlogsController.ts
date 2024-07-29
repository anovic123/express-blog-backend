import { Response } from 'express'

import {blogsQueryRepository} from "../blogsQueryRepository";

import { HTTP_STATUSES } from '../../../utils'

import { getAllBlogsHelperResult } from "../helper";

import { RequestWithQueryAndParams } from "../../../types";

export const getBlogsController = async (req: RequestWithQueryAndParams<getAllBlogsHelperResult, { id: string }>, res: Response<any>) => {
    const blogs = await blogsQueryRepository.getAllBlogs(req.query, req.params.id)

    return res.status(HTTP_STATUSES.OKK_200).json(blogs)
}