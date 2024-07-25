import {commentsCollection} from "../../db/db";

export const commentsRepository = {
        async updateComment(commentId: string): Promise<boolean> {
            return true
        },
        async deleteAll(): Promise<boolean> {
            await commentsCollection.deleteMany()

            return true
        }
}