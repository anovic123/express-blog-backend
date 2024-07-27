import {Router} from 'express'

import { HTTP_STATUSES } from '../../utils'

import {blogsRepository} from "../blogs/blogsRepository";
import {postsRepository} from "../posts/postsRepository";
import { usersRepository } from '../users/usersRepository';
import {commentsRepository} from "../comments/commentsRepository";

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAll()
    await commentsRepository.deleteAll()
    res.status(HTTP_STATUSES.NO_CONTENT_204).json({})
})