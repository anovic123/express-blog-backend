import {CommentOutputCommentatorInfoModel} from "../../domain/comment.entity";

export interface CommentViewModel {
    id: string
    content: string
    commentatorInfo: CommentOutputCommentatorInfoModel
    createdAt: string
}
