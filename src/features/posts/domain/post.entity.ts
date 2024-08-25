import * as mongoose from 'mongoose';
import { Model, model, HydratedDocument } from 'mongoose';

export type PostDbType = {
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
    blogName: string
    createdAt: string
    isMembership: boolean
}

type PostModel = Model<PostDbType>

export type PostDocument = HydratedDocument<PostModel>

const postSchema = new mongoose.Schema<PostDbType>({
    title: { type: String, required: true, max: 30 },
    shortDescription: { type: String, required: true, max: 100 },
    content: { type: String, required: true, max: 1000 },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, default: false }
})

export const PostModel = model<PostDbType, PostModel>('posts', postSchema)