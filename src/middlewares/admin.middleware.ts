import {Response, Request, NextFunction} from 'express'

import {SETTINGS} from '../settings'

import { HTTP_STATUSES } from '../utils'

export const fromUTF8ToBase64 = (code: string) => {
    const buff2 = Buffer.from(code, 'utf8')
    const codedAuth = buff2.toString('base64')
    return codedAuth
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string
    if (!auth) {
        res
            .status(HTTP_STATUSES.UNAUTHORIZED_401)
            .json({})
        return
    }
    if (auth.slice(0, 6) !== 'Basic ') {
        res
            .status(HTTP_STATUSES.UNAUTHORIZED_401)
            .json({})
        return
    }

    const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN)

    if (auth.slice(6) !== codedAuth) {
        res
            .status(HTTP_STATUSES.UNAUTHORIZED_401)
            .json({})
        return
    }

    next()
}