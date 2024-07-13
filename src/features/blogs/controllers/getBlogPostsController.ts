import { Request, Response } from 'express'
import {RequestWithParams} from "../../../types";
import {getBlogPostsHelper} from "../helper";
import {blogsRepository} from "../blogsRepository";

export const getBlogPostsController = async (req: RequestWithParams<{ blogId: string }>, res: Response) => {
    const sanitizedQuery = getBlogPostsHelper(req.query as { [key: string]: string| undefined })
    const posts = await blogsRepository.getBlogPosts(sanitizedQuery, req.params.blogId)
    return res.status(200).json(posts)
}