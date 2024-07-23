import {CommentViewModel} from "../../input-output-types/comment-types";
import {commentsCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../../db/comment-db-type";

export const commentsQueryRepository = {
    async getCommentsById (id: string): Promise<CommentDBType[] | null> {
        const commentsRes = await commentsCollection.find({ id: new ObjectId(id) }).toArray()

        if (!commentsRes) {
            return null
        }

        return commentsRes
    }
}