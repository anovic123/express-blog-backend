import { CommentOutputCommentatorInfoModel } from "../db/comment-db-type";

export interface CommentViewModel {
    id: string
    content: string
    commentatorInfo: CommentOutputCommentatorInfoModel
    createdAt: string
}
