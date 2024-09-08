import "reflect-metadata"
import { inject, injectable } from "inversify";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

import {UserAccountDocument} from "../../features/auth/domain/auth.entity";

import {SecurityQueryRepository} from "../../features/security/infra/sequrity-query.repository";

import {SETTINGS} from "../../settings";

interface JwtPayloadExtended extends JwtPayload {
    userId: string;
}

interface JwtRefreshPayloadExtended extends JwtPayload {
    userId: string;
    deviceId: string;
}

interface JwtTokensOutput {
    accessToken: string;
    refreshToken: string;
    refreshTokenExp: string;
}

@injectable()
export class JwtService {

    constructor(@inject(SecurityQueryRepository) protected securityQueryRepository: SecurityQueryRepository) {}

    public async createJWT(user: UserAccountDocument, deviceId: string): Promise<JwtTokensOutput | null> {
        const userId = user._id.toString()

        try {
            const accessToken = this._signAccessToken(userId);
            const refreshToken = this._signRefreshToken(userId, deviceId);

            const { exp: refreshTokenExp } = jwt.decode(refreshToken) as JwtPayload;

            if (!refreshTokenExp) {
                throw new Error('Failed to create JWT: unable to extract expiration');
            }

            return {
                accessToken,
                refreshToken,
                refreshTokenExp: new Date(refreshTokenExp * 1000).toISOString(),
            };
        } catch (error) {
            console.error('Error creating JWT:', error);
            return null;
        }
    }

    public async refreshTokensJWT(refreshToken: string): Promise<JwtTokensOutput | null> {
        try {
            const decodedRefresh = await this._verifyToken<JwtRefreshPayloadExtended>(refreshToken);
            if (!decodedRefresh) return null;

            const { deviceId, exp: decodedExp } = decodedRefresh;
            const deviceData = await this.securityQueryRepository.findUserDeviceById(deviceId);
            if (!deviceData) throw new Error(`No device data found for the given deviceId: ${deviceId}`);

            const isTokenExpired = decodedExp && new Date(decodedExp * 1000) < new Date(deviceData.lastActiveDate);
            if (isTokenExpired) throw new Error('Refresh token is expired or invalid');

            const newAccessToken = this._signAccessToken(decodedRefresh.userId);
            const newRefreshToken = this._signRefreshToken(decodedRefresh.userId, deviceId);

            const { exp: newRefreshTokenExp } = jwt.decode(newRefreshToken) as JwtPayload;
            if (!newRefreshTokenExp) throw new Error('Failed to refresh JWT: unable to extract expiration');

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                refreshTokenExp: new Date(newRefreshTokenExp * 1000).toISOString(),
            };
        } catch (error) {
            console.error('Error refreshing JWT tokens:', error);
            return null;
        }
    }

    public async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result =  jwt.verify(token, SETTINGS.JWT_SECRET) as JwtPayloadExtended;
            return result ? result.userId : null;
        } catch (error) {
            console.error('Error getting user ID by token:', error);
            return null;
        }
    }

    public async getDataFromRefreshToken(refreshToken: string): Promise<{ userId: string; deviceId: string } | null> {
        try {
            const decodedRefresh = await this._verifyToken<JwtRefreshPayloadExtended>(refreshToken);
            
            if (!decodedRefresh) return null;

            const { deviceId, exp: decodedExp } = decodedRefresh;
            const deviceData = await this.securityQueryRepository.findUserDeviceById(deviceId);
            if (!deviceData) throw new Error(`No device data found for the given deviceId: ${deviceId}`);

            const isTokenExpired = decodedExp && new Date(decodedExp * 1000) < new Date(deviceData.lastActiveDate);
            if (isTokenExpired) throw new Error('Refresh token is expired or invalid');

            return { userId: decodedRefresh.userId, deviceId: decodedRefresh.deviceId };
        } catch (error) {
            console.error('Error getting data from refresh token:', error);
            return null;
        }
    }

    protected _signAccessToken(userId: string): string {
        return jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: SETTINGS.TOKENS.ACCESS_TOKEN_EXPIRATION });
    }

    protected _signRefreshToken(userId: string, deviceId: string): string {
        return jwt.sign({ userId, deviceId }, SETTINGS.JWT_SECRET, { expiresIn: SETTINGS.TOKENS.REFRESH_TOKEN_EXPIRATION });
    }

    protected async _verifyToken<T extends JwtPayload>(token: string): Promise<T | null> {
        try {
            const decodedToken = jwt.verify(token, SETTINGS.JWT_SECRET) as T;

            const isDeviceValid = await this.securityQueryRepository.checkUserDeviceById(decodedToken.userId, decodedToken.deviceId);
            if (!isDeviceValid) return null;

            if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
                throw new TokenExpiredError('Token verification failed due to expiration', new Date(decodedToken.exp * 1000));
            }

            return decodedToken;
        } catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    }
}
