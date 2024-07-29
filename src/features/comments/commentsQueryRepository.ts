import {CommentViewModel} from "../../input-output-types/comment-types";
import {commentsCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../../db/comment-db-type";
import {UserDBType} from "../../db/user-db-type";

export const commentsQueryRepository = {
    async getCommentsById (id: string): Promise<CommentViewModel[]> {
        const commentsRes = await commentsCollection.find({ id: new ObjectId(id).toString() }).toArray()

        return commentsRes.map((c: any) => this.mapPostCommentsOutput(c))
    },
    async checkIsOwn (commentId: string, user: UserDBType): Promise<boolean> {
        console.log(commentId)
        const commentsRes = await commentsCollection.findOne({ id: new ObjectId(commentId).toString() })

        if (!commentsRes) {
            return false
        }

        return commentsRes.commentatorInfo.userId === new ObjectId(user.id).toString()
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