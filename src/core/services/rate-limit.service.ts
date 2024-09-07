import {RateLimitDbType} from "../../features/security/domain/rate.entity";

import {RateLimitRepository, rateLimitRepository} from "../infra/rate-limit.repository";

export class RateLimitService {
    constructor(protected rateLimitRepository: RateLimitRepository) {}

    public async setNewAttempt(newAttempt: RateLimitDbType): Promise<boolean> {
        return await rateLimitRepository.setAttempt(newAttempt)
    }
    public async isRateLimitExceeded(ip: string, url: string, sinceDate: Date, maxAttempts: number): Promise<boolean> {
        const attemptCount = await rateLimitRepository.getAttemptCountSinceDate(ip, url, sinceDate)
        return attemptCount >= maxAttempts
    }
}

export const rateLimitService = new RateLimitService(rateLimitRepository)