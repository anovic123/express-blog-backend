import {Request, Response} from 'express'

import {blogsRepository} from '../blogsRepository'

import { HTTP_STATUSES } from '../../../utils'

import {getAllBlogsHelper} from "../helper";


export const getBlogsController = async (req: Request, res: Response<any>) => {
    const sanitizedQuery = getAllBlogsHelper(req.query as { [key: string]: string | undefined })
    const blogs = await blogsRepository.getAll(sanitizedQuery, req.params.id)

    return res.status(HTTP_STATUSES.OKK_200).json(blogs)
}