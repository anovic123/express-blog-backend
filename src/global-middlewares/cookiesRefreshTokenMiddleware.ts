import { NextFunction, Response, Request } from 'express'
import {HTTP_STATUSES} from "../utils";

export const cookiesRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies['refreshToken']

    if (!refreshToken) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Access Denied. No refresh token provided')
        return
    }

    next()
}