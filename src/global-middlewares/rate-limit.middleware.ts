import { NextFunction, Request, Response } from "express";

import {rateLimitService} from "../core/services/rate-limit.service";

import {HTTP_STATUSES} from "../utils";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const MAX_ATTEMPTS: number = 5

        const ip = req.ip || '0.0.0.0'
        const url = req.originalUrl

        const isExceeded = await rateLimitService.isRateLimitExceeded(ip, url, new Date(Date.now() - 10 * 1000), MAX_ATTEMPTS)

        if (isExceeded) {
            res.status(HTTP_STATUSES.TOO_MANY_REQUEST_429).send('Too many requests, please try again later.')
            return
        }

        await rateLimitService.setNewAttempt({
            date: new Date(),
            ip,
            url
        })

        next()
    } catch (error) {
        console.log(error)
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
}