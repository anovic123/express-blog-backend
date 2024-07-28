import {commentsCollection} from "../../db/db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
        async updateComment(commentId: string, content: string): Promise<boolean> {
            await commentsCollection.updateOne({ _id: new ObjectId(commentId) }, { content })
            return true
        },
        async deleteComment(commentId: string): Promise<boolean> {
            await commentsCollection.deleteOne({ _id: new ObjectId(commentId) })
            return true
        },
        async deleteAll(): Promise<boolean> {
            await commentsCollection.deleteMany()

            return true
        }
}