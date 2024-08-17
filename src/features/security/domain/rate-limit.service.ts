import {rateLimitRepository} from "../application/rate-limit.repository";

import {RateLimitDbType} from "../../../db/rate-limit-db-type";

export const rateLimitService = {
    async setNewAttempt(newAttempt: RateLimitDbType): Promise<boolean> {
        return await rateLimitRepository.setAttempt(newAttempt)
    },
    async isRateLimitExceeded(ip: string, url: string, sinceDate: Date, maxAttempts: number): Promise<boolean> {
        const attemptCount = await rateLimitRepository.getAttemptCountSinceDate(ip, url, sinceDate)
        return attemptCount >= maxAttempts;
    }
}