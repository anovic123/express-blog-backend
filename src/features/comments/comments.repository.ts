import { commentsCollection } from "../../db/db";

export const commentsRepository = {
    async updateComment(commentId: string, content: string): Promise<boolean> {
        try {
            const result = await commentsCollection.updateOne(
                { id: commentId },
                { $set: { content } }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            console.error(`Error updating comment ${commentId}:`, error);
            return false;
        }
    },

    async deleteComment(commentId: string): Promise<boolean> {
        try {
            const result = await commentsCollection.deleteOne({ id: commentId });
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Error deleting comment ${commentId}:`, error);
            return false;
        }
    },

    async deleteAll(): Promise<boolean> {
        try {
            const result = await commentsCollection.deleteMany({});
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting all comments:', error);
            return false;
        }
    }
};
