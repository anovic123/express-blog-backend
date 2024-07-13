import { Response, Request } from 'express'
import {RequestWithParams} from "../../../types";
import {BlogPostViewModel} from "../../../input-output-types/blogs-types";
import {blogsRepository} from "../blogsRepository";

export const getBlogPostController = (req: RequestWithParams<{ blogId: string }>, res: Response<BlogPostViewModel>) => {
    // const blog = blogsRepository.

    res.status(200).json()
}