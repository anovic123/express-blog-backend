import {RateLimitDbType, RateLimitModel} from "../domain/rate.entity";

export const rateLimitRepository = {
    async getAttemptCountSinceDate(ip: string, url: string, sinceDate: Date): Promise<number> {
        return RateLimitModel.countDocuments({
            ip,
            url,
            date: {$gte: sinceDate}
        });
    },
    async setAttempt(newAttempt: RateLimitDbType): Promise<boolean> {
        try {
            const res = await RateLimitModel.insertMany([newAttempt])
            return true
        } catch (error) {
            console.error("Error inserting new attempt:", error);
            return false;
        }
    },
    async deleteAll(): Promise<boolean> {
        try {
            const result = await RateLimitModel.deleteMany({});
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting all comments:', error);
            return false;
        }
    }
}