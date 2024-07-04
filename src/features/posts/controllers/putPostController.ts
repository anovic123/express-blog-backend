import { Response} from 'express'
import { PostInputModel } from '../../../input-output-types/posts-types'
import { postsRepository } from '../postsRepository'
import { HTTP_STATUSES } from '../../../utils'
import { RequestWithParamsAndBody } from '../../../types'

export const putPostController = async (req: RequestWithParamsAndBody<{id: string}, PostInputModel>, res: Response) => {
    await postsRepository.put(req.body, req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}