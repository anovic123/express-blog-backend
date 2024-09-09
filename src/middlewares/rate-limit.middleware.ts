import "reflect-metadata";
import { injectable, inject, Container } from "inversify";
import { NextFunction, Request, Response } from "express";

import { RateLimitService } from "../core/services/rate-limit.service";
import { HTTP_STATUSES } from "../utils";
import { RateLimitRepository } from "../core/infra/rate-limit.repository";

@injectable()
export class RateLimitMiddleware {
    constructor(
        @inject(RateLimitService) protected rateLimitService: RateLimitService
    ) {}

    public async use(req: Request, res: Response, next: NextFunction) {
        try {
            const MAX_ATTEMPTS: number = 5;

            const ip = req.ip || '0.0.0.0';
            const url = req.originalUrl;

            const isExceeded = await this.rateLimitService.isRateLimitExceeded(ip, url, new Date(Date.now() - 10 * 1000), MAX_ATTEMPTS);

            if (isExceeded) {
                res.status(HTTP_STATUSES.TOO_MANY_REQUEST_429).send('Too many requests, please try again later.');
                return;
            }

            await this.rateLimitService.setNewAttempt({
                date: new Date(),
                ip,
                url,
            });

            next();
        } catch (error) {
            console.log(error);
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
    }
}


const container = new Container();

container.bind(RateLimitService).to(RateLimitService);
container.bind(RateLimitRepository).to(RateLimitRepository)
container.bind(RateLimitMiddleware).to(RateLimitMiddleware);

export { container };
