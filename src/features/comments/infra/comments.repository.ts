import {CommentModel} from "../domain/comment.entity";

export class CommentsRepository {
    public async updateComment(commentId: string, content: string): Promise<boolean> {
        try {
            const result = await CommentModel.updateOne(
                { id: commentId },
                { $set: { content } }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            console.error(`Error updating comment ${commentId}:`, error);
            return false;
        }
    }

    public async deleteComment(commentId: string): Promise<boolean> {
        try {
            const result = await CommentModel.deleteOne({ id: commentId });
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Error deleting comment ${commentId}:`, error);
            return false;
        }
    }

    public async deleteAll(): Promise<boolean> {
        try {
            const result = await CommentModel.deleteMany({});
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting all comments:', error);
            return false;
        }
    }
};
