import express, { Request, Response } from 'express'
import cors from 'cors'

import { videosRouter } from './routes/videos'
import { testingRouter } from './routes/testing'

import { SETTINGS } from './settings'

export const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ version: '1.0' })
})

app.use(SETTINGS.PATH.VIDEOS, videosRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
