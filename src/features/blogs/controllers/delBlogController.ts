import {Request, Response} from 'express'
import {blogsRepository} from '../blogsRepository'

export const delBlogController = (req: Request<{id: string}>, res: Response) => {
    const removeRes = blogsRepository.del(req.params.id)

    if (removeRes) {
        res.sendStatus(204)
        return
    }

    res.sendStatus(404)
}