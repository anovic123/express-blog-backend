import "reflect-metadata"
import { inject, injectable } from "inversify";

import {CommentsRepository} from "../infra/comments.repository";

import {CommentLikesViewModel} from "../dto/output";

import {LikeStatus} from "../domain/like.entity";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsRepository) protected commentsRepository: CommentsRepository) {}

    public async deleteComment(commentId: string) {
        return await this.commentsRepository.deleteComment(commentId)
    }
    public async updateComment(commentId: string, content: string) {
        return await this.commentsRepository.updateComment(commentId, content)
    }
    public async likeComment(
        commentId: string,
        likesInfo: CommentLikesViewModel | null,
        likeStatus: LikeStatus,
        userId: string | undefined
    ): Promise<boolean> {
        if (!userId) return false;

        if (likesInfo?.myStatus === likeStatus) {
            return false;
        }

        const postId = await this.commentsRepository.getPostIdByCommentId(commentId);
        if (!postId) return false;

        switch (likeStatus) {
            case LikeStatus.NONE:
                if (likesInfo?.myStatus === LikeStatus.DISLIKE || likesInfo?.myStatus === LikeStatus.LIKE) {
                    await this.commentsRepository.noneStatusComment(commentId, userId, postId);
                } else if (likesInfo?.myStatus === LikeStatus.NONE) {
                    await this.commentsRepository.likeComment(commentId, userId, postId);
                }
                
                break;
            case LikeStatus.LIKE:
                await this.commentsRepository.likeComment(commentId, userId, postId);
                break;
            case LikeStatus.DISLIKE:
                await this.commentsRepository.dislikeComment(commentId, userId, postId);
                break;
            default:
                return false;
        }

        return true;
    }
    
}