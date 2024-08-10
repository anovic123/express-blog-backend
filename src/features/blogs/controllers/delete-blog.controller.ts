import { Response } from 'express'

import {blogsRepository} from '../blogs.repository'
import {blogsQueryRepository} from "../blogs-query.repository";

import { HTTP_STATUSES } from '../../../utils';

import { RequestWithParams } from '../../../types/common';

export const deleteBlogController = async (req: RequestWithParams<{id: string}>, res: Response) => {
    const blogId = req.params.id;
    const blog = await blogsQueryRepository.findBlog(blogId);

    if (!blog) {
        return res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' });
    }

    await blogsRepository.del(req.params.id)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}