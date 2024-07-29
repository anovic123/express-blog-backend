import {ObjectId} from "mongodb";

export type CommentDBType = {
    id: string
    content: string
    commentatorInfo: CommentOutputCommentatorInfoModel
    createdAt: string
    postId?: string
    _id?: ObjectId
}

export type CommentOutputCommentatorInfoModel = {
    userId: string
    userLogin: string
}