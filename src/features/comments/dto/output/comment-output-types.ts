import {CommentOutputCommentatorInfoModel} from "../../domain/comment.entity";
import {LikeStatus} from "../../domain/like.entity";

export interface CommentViewModel {
    id: string
    content: string
    commentatorInfo: CommentOutputCommentatorInfoModel
    createdAt: string
    likesInfo: CommentLikesViewModel
}

export interface CommentLikesViewModel {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}