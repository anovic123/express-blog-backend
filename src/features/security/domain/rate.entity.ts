import * as mongoose from 'mongoose';
import { Model, model, HydratedDocument, ObjectId } from 'mongoose';

export type RateLimitDbType = {
    date: Date,
    ip: string,
    url: string
}

type RateLimitModel = Model<RateLimitDbType>

export type RateLimitDocument = HydratedDocument<RateLimitDbType>

const rateLimitSchema = new mongoose.Schema<RateLimitDbType>({
    date: { type: Date, required: true },
    ip: { type: String, required: true },
    url: { type: String, required: true }
})

export const RateLimitModel = model<RateLimitDbType, RateLimitModel>('rate-limit', rateLimitSchema)