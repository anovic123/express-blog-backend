import {CommentDBType, CommentModel} from "../domain/comment.entity";
import {UserAccountDBType} from "../../auth/domain/auth.entity";

import {CommentViewModel} from "../../../types/comment-types";

export const commentsQueryRepository = {
    async getCommentById(id: CommentViewModel['id']): Promise<CommentViewModel | null> {
        const comment = await CommentModel.findOne({ id });
        return comment ? this.mapPostCommentsOutput(comment) : null;
    },
    async checkIsOwn (commentId: string, user: UserAccountDBType): Promise<boolean> {
        const commentsRes = await CommentModel.findOne({ id: commentId })

        if (!commentsRes) {
            return false
        }

        return commentsRes.commentatorInfo.userId === user._id.toString()
    },
    mapPostCommentsOutput(comment: CommentDBType): CommentViewModel {
        const commentForOutput = {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
        return commentForOutput
    }
}