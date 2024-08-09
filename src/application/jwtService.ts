import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { UserAccountDBType } from '../db/user-db-type';
import { SETTINGS } from '../settings';
import {authQueryRepository} from "../features/auth/auth.query.repository";
import {authRepository} from "../features/auth/auth.repository";

interface JwtPayloadExtended extends JwtPayload {
    userId: string;
}

export const jwtService = {
    createJWT(user: UserAccountDBType): { accessToken: string, refreshToken: string } {
        const userId = new ObjectId(user._id).toString();
        const accessToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: '10s' });
        const refreshToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: '20s' });
        return { accessToken, refreshToken };
    },
    async refreshTokensJWT(refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        try {
            const blackListRes = await authQueryRepository.checkBlackListTokens(refreshToken)

            if (blackListRes) {
                throw new Error('Token in the black list')
            }

            const decoded = jwt.verify(refreshToken, SETTINGS.JWT_SECRET) as JwtPayloadExtended;

            if (decoded?.userId) {
                const userId = new ObjectId(decoded.userId).toString();
                const accessToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: '10s' });
                const refreshToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: '20s' });
                return { accessToken, refreshToken };
            }
            throw new Error('Invalid token');
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
    async addTokensToBlackList (refreshToken: string): Promise<boolean> {
        const res = await authRepository.addTokenToBlackList(refreshToken)

        return !!res;
    }
};
