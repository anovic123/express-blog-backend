import { blackListTokensCollection } from "../../db/db";

export const authQueryRepository = {
    async checkBlackListTokens(token: string): Promise<boolean> {
        const findedToken = await blackListTokensCollection.findOne({ token });
        return !!findedToken;
    }
};