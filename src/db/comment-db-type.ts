import {ObjectId} from "mongodb";

export type CommentDBType = {
    id: ObjectId
    content: string
    commentatorInfo: CommentOutputCommentatorInfoModel
    createdAt: string
}

export type CommentOutputCommentatorInfoModel = {
    userId: string
    userLogin: string
}