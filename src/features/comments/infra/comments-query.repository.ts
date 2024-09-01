import {CommentDBType, CommentModel} from "../domain/comment.entity";
import {UserAccountDBType} from "../../auth/domain/auth.entity";

import {CommentViewModel} from "../dto/output";

import {LikeDBType, LikeModel, LikeStatus} from "../domain/like.entity";

export class CommentsQueryRepository {
    async getCommentById(id: CommentViewModel['id']): Promise<CommentViewModel | null> {
        const comment = await CommentModel.findOne({ id });
        const like = await LikeModel.find({ commentId: id })
        return comment ? this.mapPostCommentsOutput(comment, like) : null;
    }
    async checkIsOwn (commentId: string, user: UserAccountDBType): Promise<boolean> {
        const commentsRes = await CommentModel.findOne({ id: commentId })

        if (!commentsRes) {
            return false
        }

        return commentsRes.commentatorInfo.userId === user._id.toString()
    }
    mapPostCommentsOutput(comment: CommentDBType, like: LikeDBType[] | null): CommentViewModel {
        const commentForOutput = {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: like?.filter(l => l.status === LikeStatus.LIKE).length ?? 0,
                dislikesCount: like?.filter(l => l.status === LikeStatus.Dislike).length ?? 0,
                myStatus: LikeStatus.LIKE
            }
        }
        return commentForOutput
    }
}