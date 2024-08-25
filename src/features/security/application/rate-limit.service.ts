import {RateLimitDbType} from "../domain/rate.entity";

import {rateLimitRepository} from "../infra/rate-limit.repository";

export const rateLimitService = {
    async setNewAttempt(newAttempt: RateLimitDbType): Promise<boolean> {
        return await rateLimitRepository.setAttempt(newAttempt)
    },
    async isRateLimitExceeded(ip: string, url: string, sinceDate: Date, maxAttempts: number): Promise<boolean> {
        const attemptCount = await rateLimitRepository.getAttemptCountSinceDate(ip, url, sinceDate)
        return attemptCount >= maxAttempts
    }
}