import express from 'express'
import cors from 'cors'

import {SETTINGS} from './settings'

import {blogsRouter} from './features/blogs'
import {testingRouter} from './features/testing'
import {postsRouter} from "./features/posts";
import { authRouter } from './features/auth'
import { usersRouter } from './features/users'
import {commentsRouter} from "./features/comments";

export const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)