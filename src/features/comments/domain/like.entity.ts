import * as mongoose from 'mongoose'
import { Model, model, HydratedDocument } from "mongoose";

export enum LikeCommentStatus {
    NONE = 'None',
    LIKE = 'Like',
    DISLIKE = 'Dislike'
}

export type LikeCommentDBType = {
    createdAt: Date,
    status: LikeCommentStatus,
    authorId: string,
    commentId: string,
    postId: string
}

type LikeCommentModel = Model<LikeCommentDBType>

export type LikeCommentDocument = HydratedDocument<LikeCommentDBType>

const likeCommentSchema = new mongoose.Schema<LikeCommentDBType>({
    createdAt: { type: Date, required: true },
    status: { type: String, enum: LikeCommentStatus, required: true },
    authorId: { type: String, required: true},
    commentId: { type: String, required: true },
    postId: { type: String, required: true }
})

export const LikeCommentModel = model<LikeCommentDBType, LikeCommentModel>('likes-comments', likeCommentSchema)