import {ObjectId} from "mongodb";

import {commentsCollection} from "../../db/db";

import {CommentDBType} from "../../db/comment-db-type";
import {UserAccountDBType} from "../../db/user-db-type";

import {CommentViewModel} from "../../types/comment-types";

export const commentsQueryRepository = {
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const comment = await commentsCollection.findOne({ id: new ObjectId(id).toString() });
        return comment ? this.mapPostCommentsOutput(comment) : null;
    },
    async checkIsOwn (commentId: string, user: UserAccountDBType): Promise<boolean> {
        const commentsRes = await commentsCollection.findOne({ id: new ObjectId(commentId).toString() })

        if (!commentsRes) {
            return false
        }

        return commentsRes.commentatorInfo.userId === new ObjectId(user._id).toString()
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