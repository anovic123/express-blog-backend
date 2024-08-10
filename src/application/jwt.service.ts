import { ObjectId } from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { authQueryRepository } from "../features/auth/auth-query.repository";
import { authRepository } from "../features/auth/auth.repository";

import { UserAccountDBType } from '../db/user-db-type';

import { SETTINGS } from '../settings';

interface JwtPayloadExtended extends JwtPayload {
    userId: string;
}

export const jwtService = {
    async createJWT(user: UserAccountDBType): Promise<{ accessToken: string, refreshToken: string } | null> {
        const userId = new ObjectId(user._id).toString();

        const accessToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: '10s' });
        const refreshToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: '20s' });
        return { accessToken, refreshToken };
    },

    async refreshTokensJWT(refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        try {
            const blackListRes = await authQueryRepository.checkBlackListTokens(refreshToken);
            if (blackListRes) {
                return null
            }
            await this.addTokensToBlackList(refreshToken)
            const decoded = jwt.verify(refreshToken, SETTINGS.JWT_SECRET) as JwtPayloadExtended;

            if (decoded?.userId) {
                const userId = new ObjectId(decoded.userId).toString();

                const newAccessToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: '10s' });
                const newRefreshToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: '20s' });

                return { accessToken: newAccessToken, refreshToken: newRefreshToken };
            }
            return null
        } catch (error) {
            return null;
        }
    },

    async getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, SETTINGS.JWT_SECRET) as JwtPayloadExtended;
            return new ObjectId(result.userId);
        } catch (error) {
            return null;
        }
    },

    async addTokensToBlackList(refreshToken: string): Promise<boolean> {
        try {
            const tokenVerify = jwt.verify(refreshToken, SETTINGS.JWT_SECRET)

            if (!tokenVerify) return false

            const blackListRes = await authQueryRepository.checkBlackListTokens(refreshToken);
            if (blackListRes) {
                return false
            }


            const res = await authRepository.addTokenToBlackList(refreshToken);
            return !!res;
        } catch (error) {
            return false;
        }
    }
};
