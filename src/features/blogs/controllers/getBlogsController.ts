import {Request, Response} from 'express'
import { body, validationResult, query, param } from "express-validator";

import {BlogViewModel} from '../../../input-output-types/blogs-types'

import {blogsRepository} from '../blogsRepository'

import { HTTP_STATUSES } from '../../../utils'
import {ObjectId, SortDirection} from "mongodb";

export const getBlogsController = async (req: Request, res: Response<any>) => {
    const blogs = await blogsRepository.getAll()

    // const byId = blogId ? { blogId: new ObjectId(blogId) }

    // return res.status(HTTP_STATUSES.OKK_200).json(blogs)
    // return res.status(HTTP_STATUSES.OKK_200).json({
    //     pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
    //     pageSize: req.query.pageSize !== undefined ? +req.query.pageSize : 10,
    //     sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
    //     sortDirection: req.query.sortDirection ? req.query.sortDirection as SortDirection : 'desc',
    //     searhNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : null
    // })
}