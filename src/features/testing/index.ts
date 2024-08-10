import {Router} from 'express'

import { HTTP_STATUSES } from '../../utils'

import {blogsRepository} from "../blogs/blogs.repository";
import {postsRepository} from "../posts/posts.repository";
import { usersRepository } from '../users/users.repository';
import {commentsRepository} from "../comments/comments.repository";

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAll()
    await commentsRepository.deleteAll()
    res.status(HTTP_STATUSES.NO_CONTENT_204).json({})
})