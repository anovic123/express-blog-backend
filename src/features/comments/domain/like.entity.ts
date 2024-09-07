import * as mongoose from 'mongoose'
import { Model, model, HydratedDocument } from "mongoose";

export enum LikeStatus {
    NONE = 'None',
    LIKE = 'Like',
    DISLIKE = 'Dislike'
}

export type LikeDBType = {
    createdAt: Date,
    status: LikeStatus,
    authorId: string,
    commentId: string,
    postId: string
}

type LikeModel = Model<LikeDBType>

export type LikeDocument = HydratedDocument<LikeDBType>

const likeSchema = new mongoose.Schema<LikeDBType>({
    createdAt: { type: Date, required: true },
    status: { type: String, enum: LikeStatus, required: true },
    authorId: { type: String, required: true},
    commentId: { type: String, required: true },
    postId: { type: String, required: true }
})

export const LikeModel = model<LikeDBType, LikeModel>('likes', likeSchema)