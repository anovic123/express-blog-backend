import { ObjectId } from "mongodb";

import {blackListTokensCollection} from "../../db/db";

export const authRepository = {
    async addTokenToBlackList (refreshToken: string) {
        const result = await blackListTokensCollection.insertOne({
            token: refreshToken,
            _id: new ObjectId()
        })

        return result.insertedId
    }
}