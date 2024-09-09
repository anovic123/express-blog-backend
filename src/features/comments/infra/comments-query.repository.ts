import "reflect-metadata"
import { injectable } from "inversify";

import { CommentDBType, CommentModel } from "../domain/comment.entity";
import { LikeCommentDBType, LikeCommentModel, LikeCommentStatus } from "../domain/like.entity";

import { UserAccountDBType } from "../../auth/domain/auth.entity";

import { CommentViewModel } from "../dto/output";

@injectable()
export class CommentsQueryRepository {
    async getCommentById(id: CommentViewModel['id'], userId?: string | null | undefined): Promise<CommentViewModel | null> {
        try {
            const comment = await CommentModel.findOne({ id });

            if (!comment) return null;

            const likes = await LikeCommentModel.find({ commentId: id });
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

    public mapPostCommentsOutput(comment: CommentDBType, likes: LikeCommentDBType[] = [], userLike: LikeCommentDBType | null = null): CommentViewModel {
        const likesCount = likes.filter(l => l.status === LikeCommentStatus.LIKE).length;
        const dislikesCount = likes.filter(l => l.status === LikeCommentStatus.DISLIKE).length;
        const myStatus = userLike?.status ?? LikeCommentStatus.NONE;

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

export const commentsQueryRepository = new CommentsQueryRepository()