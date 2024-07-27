import {commentsRepository} from "../commentsRepository";

export const commentsService = {
    async deleteComment(commentId: string) {
       return await commentsRepository.deleteComment(commentId)
    },
    async updateComment(commentId: string, content: string) {
        return await commentsRepository.updateComment(commentId, content)
    }
}