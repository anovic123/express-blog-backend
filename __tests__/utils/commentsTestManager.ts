import {CommentDBType} from "../../src/db/comment-db-type";
import {HTTP_STATUSES, HttpStatusType} from "../../src/utils";
import {req} from "../helpers/test-helpers";
import {SETTINGS} from "../../src/settings";
import {ObjectId} from "mongodb";


export const commentsTestManager = {
    async getAllComments(id: CommentDBType['id'], expectedStatusCode: HttpStatusType = HTTP_STATUSES.OKK_200) {
        const allCommentsRes = await req.get(`${SETTINGS.PATH.COMMENTS}/${new ObjectId(id).toString()}`).expect(expectedStatusCode)

        return allCommentsRes
    }
}