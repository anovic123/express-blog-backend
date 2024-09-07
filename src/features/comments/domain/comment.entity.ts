import * as mongoose from 'mongoose';
import { Model, model, HydratedDocument, ObjectId } from 'mongoose';

export type CommentDBType = {
    id: string
    content: string
    commentatorInfo: CommentOutputCommentatorInfoModel
    createdAt: string
    postId?: string
}

export type CommentOutputCommentatorInfoModel = {
    userId: string
    userLogin: string
}

type CommentModel = Model<CommentDBType>

export type CommentDocument = HydratedDocument<CommentDBType>

const commentSchema = new mongoose.Schema<CommentDBType>({
    id: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true }
    },
    createdAt: { type: String, required: true, default: new Date().toISOString() },  
    postId: { type: String, required: false },
})

export const CommentModel = model<CommentDBType, CommentModel>('comments', commentSchema)