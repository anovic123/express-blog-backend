import * as mongoose from 'mongoose'
import { Model, model, HydratedDocument } from "mongoose";

export enum LikePostStatus {
    NONE = 'None',
    LIKE = 'Like',
    DISLIKE = 'Dislike'
}

export type LikePostDBType = {
    createdAt: Date,
    status: LikePostStatus,
    authorId: string,
    commentId: string,
    postId: string,
    login: string
}

type LikePostModel = Model<LikePostDBType>

export type LikePostDocument = HydratedDocument<LikePostDBType>

const likePostSchema = new mongoose.Schema<LikePostDBType>({
    createdAt: { type: Date, required: true, default: new Date() },
    status: { type: String, enum: LikePostStatus, required: true },
    authorId: { type: String, required: true},
    postId: { type: String, required: true },
    login: { type: String, required: true }
})

export const LikePostModel = model<LikePostDBType, LikePostModel>('likes-posts', likePostSchema)