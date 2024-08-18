import { Response } from 'express'

import {blogsService} from "../domain/blogs.service";

import {blogsQueryRepository} from "../blogs-query.repository";

import { HTTP_STATUSES } from '../../../utils';

import { RequestWithParams } from '../../../types/common';

export const deleteBlogController = async (req: RequestWithParams<{id: string}>, res: Response) => {
    const blogId = req.params.id;
    const blog = await blogsQueryRepository.findBlog(blogId);

    if (!blog) {
        return res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' });
    }

    await blogsService.deleteBlog(req.params.id)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}