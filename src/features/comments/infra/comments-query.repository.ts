import { Types } from "mongoose";

import { CommentDBType, CommentModel } from "../domain/comment.entity";
import { LikeDBType, LikeModel, LikeStatus } from "../domain/like.entity";

import { UserAccountDBType } from "../../auth/domain/auth.entity";

import { CommentViewModel } from "../dto/output";

export class CommentsQueryRepository {
    async getCommentById(id: CommentViewModel['id'], userId?: string | null | undefined): Promise<CommentViewModel | null> {
        try {
            const comment = await CommentModel.findOne({ id });

            if (!comment) return null;

            const likes = await LikeModel.find({ commentId: id });
            const userLike = userId ? likes.find(like => like.authorId === userId) : null;
            return this.mapPostCommentsOutput(comment, likes, userLike);
        } catch (error) {
            console.error('Error fetching comment by ID:', error);
            throw new Error('Failed to fetch comment.');
        }
    }

    async checkIsOwn(commentId: string, user: UserAccountDBType): Promise<boolean> {
        try {
            const comment = await CommentModel.findOne({ id: commentId });

            if (!comment) return false;

            return comment.commentatorInfo.userId === user._id.toString();
        } catch (error) {
            console.error('Error checking comment ownership:', error);
            throw new Error('Failed to check ownership.');
        }
    }

    public mapPostCommentsOutput(comment: CommentDBType, likes: LikeDBType[] = [], userLike: LikeDBType | null = null): CommentViewModel {
        const likesCount = likes.filter(l => l.status === LikeStatus.LIKE).length;
        const dislikesCount = likes.filter(l => l.status === LikeStatus.DISLIKE).length;
        const myStatus = userLike?.status ?? LikeStatus.NONE;

        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount,
                dislikesCount,
                myStatus,
            },
        };
    }
}

