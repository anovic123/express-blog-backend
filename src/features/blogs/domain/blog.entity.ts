import * as mongoose from 'mongoose'
import { Model, model, HydratedDocument, ObjectId } from 'mongoose';

export type BlogDbType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

type BlogModel = Model<BlogDbType>

export type BlogDocument = HydratedDocument<BlogDbType>

const blogSchema = new mongoose.Schema<BlogDbType>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, default: false }
})

export const BlogModel = model<BlogDbType, BlogModel>('blogs', blogSchema)