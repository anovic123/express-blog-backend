import {Request, Response} from 'express'
import {blogsRepository} from '../blogsRepository'

export const delBlogController = (req: Request<{id: string}>, res: Response) => {
    const blogId = req.params.id;
    const blog = blogsRepository.find(blogId);

    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    blogsRepository.del(req.params.id)

    return res.sendStatus(204)
}