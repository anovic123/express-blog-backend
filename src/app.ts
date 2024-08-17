import express, { Response, Request } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {blogsRouter} from './features/blogs'
import {testingRouter} from './features/testing'
import {postsRouter} from './features/posts'
import {authRouter} from './features/auth'
import {usersRouter} from './features/users'
import {commentsRouter} from './features/comments'
import {securityRouter} from './features/security'

import {SETTINGS} from './settings'

import {HTTP_STATUSES} from './utils'

export const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.set('trust proxy', true)

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OKK_200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.SECURITY, securityRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
