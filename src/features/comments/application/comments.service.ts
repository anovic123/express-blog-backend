import {CommentsRepository} from "../infra/comments.repository";
import {CommentsQueryRepository} from "../infra/comments-query.repository";
import {CommentViewModel} from "../dto/output";

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository, protectedRepository: CommentsQueryRepository) {}

    public async deleteComment(commentId: string) {
        return await this.commentsRepository.deleteComment(commentId)
    }
    public async updateComment(commentId: string, content: string) {
        return await this.commentsRepository.updateComment(commentId, content)
    }
    public async likeComment(commentId: string, comment: CommentViewModel, likeStatus: 'None' | 'Like' | 'Dislike'): Promise<boolean> {
        switch (likeStatus) {
            case 'None':
                if (comment.likesInfo.myStatus === 'Like') {
                    // Logic like
                } else {
                    // Logic dislike
                }
                break
            case 'Like':
                // logic like
                break
            case 'Dislike':
                // logic dislike
                break
            default:
                return false
        }

        return true
    }
}