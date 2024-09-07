import { Response } from 'express'

import { HTTP_STATUSES } from '../../../utils';

import {RequestWithParams} from "../../../core/request-types";

import {blogsQueryRepository, blogsService} from "../composition-root";

export const deleteBlogController = async (req: RequestWithParams<{id: string}>, res: Response) => {
    try {
        const blogId = req.params.id;
        const blog = await blogsQueryRepository.findBlog(blogId);

        if (!blog) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' });
            return
        }

        await blogsService.deleteBlog(req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('deleteBlogController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}