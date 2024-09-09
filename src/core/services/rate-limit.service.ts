import "reflect-metadata"
import { inject, injectable } from "inversify";
import {RateLimitDbType} from "../../features/security/domain/rate.entity";

import {RateLimitRepository} from "../infra/rate-limit.repository";

@injectable()
export class RateLimitService {
    constructor(@inject(RateLimitRepository) protected rateLimitRepository: RateLimitRepository) {}

    public async setNewAttempt(newAttempt: RateLimitDbType): Promise<boolean> {
        return await this.rateLimitRepository.setAttempt(newAttempt)
    }
    public async isRateLimitExceeded(ip: string, url: string, sinceDate: Date, maxAttempts: number): Promise<boolean> {
        const attemptCount = await this.rateLimitRepository.getAttemptCountSinceDate(ip, url, sinceDate)
        return attemptCount >= maxAttempts
    }
}
