import {rateLimitCollection} from "../../../db/db";
import { RateLimitDbType } from "../../../db/rate-limit-db-type";

export const rateLimitRepository = {
    async getAttemptCountSinceDate(ip: string, url: string, sinceDate: Date): Promise<number> {
        return await rateLimitCollection.countDocuments({
            ip,
            url,
            date: { $gte: sinceDate }
        });
    },
    async setAttempt(newAttempt: RateLimitDbType): Promise<boolean> {
        try {
            const res= await rateLimitCollection.insertOne(newAttempt);
            return !!res.insertedId;
        } catch (error) {
            console.error("Error inserting new attempt:", error);
            return false;
        }
    },
    async deleteAll(): Promise<boolean> {
        try {
            const result = await rateLimitCollection.deleteMany({});
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting all comments:', error);
            return false;
        }
    }
}
