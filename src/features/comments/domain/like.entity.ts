import * as mongoose from 'mongoose'
import { Model, model, HydratedDocument } from "mongoose";

export enum LikeStatus {
    NONE = 'None',
    LIKE = 'Like',
    Dislike = 'Dislike'
}

export type LikeDBType = {
    createdAt: Date,
    status: LikeStatus,
    authorId: string,
    commentId: string,
    postId: string
    // parentId: string
}

type LikeModel = Model<LikeDBType>

export type LikeDocument = HydratedDocument<LikeDBType>

const likeSchema = new mongoose.Schema<LikeDBType>({
    createdAt: { type: Date, required: true },
    status: { type: String, enum: LikeStatus, required: true },
    authorId: { typeId: String, required: true},
    // parentId: { typeId: String, required: true },
    commentId: { typeId: String, required: true },
    postId: { typeId: String, required: true }
})

export const LikeModel = model<LikeDBType, LikeModel>('likes', likeSchema)