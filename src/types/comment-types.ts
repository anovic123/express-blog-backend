import {CommentOutputCommentatorInfoModel} from "../features/comments/domain/comment.entity";

export interface CommentViewModel {
    id: string
    content: string
    commentatorInfo: CommentOutputCommentatorInfoModel
    createdAt: string
}
