import {blackListTokensCollection} from "../../db/db";

export const authQueryRepository = {
    async checkBlackListTokens (refreshToken: string): Promise<boolean> {
        const findedToken = await blackListTokensCollection.find({ token: refreshToken }).toArray()

        return findedToken.length >= 1
    }
}