import {CommentsRepository} from "../infra/comments.repository";
import {CommentsQueryRepository} from "../infra/comments-query.repository";

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository, protectedRepository: CommentsQueryRepository) {}

    public async deleteComment(commentId: string) {
        return await this.commentsRepository.deleteComment(commentId)
    }
    public async updateComment(commentId: string, content: string) {
        return await this.commentsRepository.updateComment(commentId, content)
    }
}