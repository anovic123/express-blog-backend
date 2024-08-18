import { ObjectId } from 'mongodb';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

import { authQueryRepository } from '../auth-query.repository';
import { authRepository } from '../auth.repository';

import { UserAccountDBType } from '../../../db/user-db-type';

import { SETTINGS } from '../../../settings';

interface JwtPayloadExtended extends JwtPayload {
    userId: string
}

interface JwtRefreshPayloadExtended extends JwtPayload {
    userId: string
    deviceId: string
}

interface JwtTokensOutput {
    accessToken: string
    refreshToken: string
    refreshTokenExp: string
}

export const jwtService = {
    async createJWT(user: UserAccountDBType, deviceId: string): Promise<JwtTokensOutput | null> {
        const userId = new ObjectId(user._id).toString();

        const accessToken = this._signAccessToken(userId);
        const refreshToken = this._signRefreshToken(userId, deviceId);

        const refreshTokenExp = this._calculateExpiration(20);

        return { accessToken, refreshToken, refreshTokenExp };
    },

    async refreshTokensJWT(refreshToken: string): Promise<JwtTokensOutput | null> {
        try {
            if (await this.isTokenInBlackList(refreshToken)) return null;
            const decoded = await this._verifyToken<JwtRefreshPayloadExtended>(refreshToken);

            if (!decoded || !decoded.userId || !decoded.deviceId) return null;

            await this.addTokensToBlackList(refreshToken);

            const newAccessToken = this._signAccessToken(decoded.userId);
            const newRefreshToken = this._signRefreshToken(decoded.userId, decoded.deviceId);

            const refreshTokenExp = this._calculateExpiration(20);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken, refreshTokenExp };
        } catch (error) {
            console.error('Error refreshing JWT tokens:', error);
            return null;
        }
    },

    async getUserIdByToken(token: string): Promise<ObjectId | null> {
        try {
            const result = await this._verifyToken<JwtPayloadExtended>(token);
            return result ? new ObjectId(result.userId) : null;
        } catch (error) {
            console.error('Error getting user ID by token:', error);
            return null;
        }
    },

    async getDataFromRefreshToken(refreshToken: string): Promise<{ userId: string; deviceId: string } | null> {
        try {
            const result = await this._verifyToken<JwtRefreshPayloadExtended>(refreshToken);
            return result ? { userId: result.userId, deviceId: result.deviceId } : null;
        } catch (error) {
            console.error('Error getting data from refresh token:', error);
            return null;
        }
    },

    async addTokensToBlackList(refreshToken: string): Promise<boolean> {
        try {
            if (!this._verifyToken(refreshToken)) return false;
            if (await this.isTokenInBlackList(refreshToken)) return false;

            const res = await authRepository.addTokenToBlackList(refreshToken);
            return !!res;
        } catch (error) {
            console.error('Error adding token to blacklist:', error);
            return false;
        }
    },

    async isTokenInBlackList(token: string): Promise<boolean> {
        return await authQueryRepository.checkBlackListTokens(token);
    },

    _signAccessToken(userId: string): string {
        return jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: '10s' });
    },

    _signRefreshToken(userId: string, deviceId: string): string {
        return jwt.sign({ userId, deviceId }, SETTINGS.JWT_SECRET, { expiresIn: '20s' });
    },

    _calculateExpiration(seconds: number): string {
        return new Date(Date.now() + seconds * 1000).toISOString();
    },

    async _verifyToken<T extends JwtPayload>(token: string): Promise<T | null> {
        try {
            if (await this.isTokenInBlackList(token)) {
                console.error('Token verification failed: Token is in the blacklist');
                return null;
            }

            const decodedToken = jwt.verify(token, SETTINGS.JWT_SECRET) as T;

            if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
                console.error('Token verification failed due to expiration');
                return null;
            }

            return decodedToken;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                console.error('Token verification failed due to expiration:', error);
            } else {
                console.error('Token verification failed:', error);
            }
            return null;
        }
    }
};
