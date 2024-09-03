import {CommentsRepository} from "../infra/comments.repository";
import {CommentsQueryRepository} from "../infra/comments-query.repository";

import {CommentLikesViewModel} from "../dto/output";

import {commentsRepository} from "../composition-root";

import {LikeStatus} from "../domain/like.entity";

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository, protectedRepository: CommentsQueryRepository) {}

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

        switch (likeStatus) {
            case LikeStatus.NONE:
                if (likesInfo?.myStatus === LikeStatus.LIKE) {
                    await commentsRepository.removeLike(commentId, userId);
                }
                break;
            case LikeStatus.LIKE:
                await commentsRepository.likeComment(commentId, userId);
                break;
            case LikeStatus.DISLIKE:
                await commentsRepository.dislikeComment(commentId, userId);
                break;
            default:
                return false;
        }

        return true;
    }
}