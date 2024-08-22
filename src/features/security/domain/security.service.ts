import { v4 as uuidv4 } from 'uuid'

import {securityRepository} from "../application/security.repository";

import { jwtService } from '../../auth/application/jwt.service';

import { HTTP_STATUSES } from '../../../utils';

import {AuthDevicesDbType} from "../../../db/auth-devices-db-type";
import { UserAccountDBType } from '../../../db/user-db-type';

import { RequestResult } from '../../../types/common';

interface TokensResponse {
    accessToken: string
    refreshToken: string
}

export const securityService = {
    async addNewUserDevice(user: UserAccountDBType, ip: string = '0.0.0.0', userAgent: string = 'Unknown'): Promise<RequestResult<TokensResponse | null>> {
        try {
            const deviceId = uuidv4()
            
            const tokens = await jwtService.createJWT(user, deviceId)
            if (!tokens) {
                return {
                    statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
                    data: null
                }
            }

            await securityRepository.insertNewUserDevice({
                ip,
                user_id: user._id,
                devices_id: deviceId,
                devices_name: userAgent,
                exp: tokens.refreshTokenExp
            })

            return {
                statusCode: HTTP_STATUSES.OKK_200,
                data: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }
            }

        } catch (error) {
            console.error('addNewUserDevice', error)
            return {
                statusCode: HTTP_STATUSES.INTERNAL_SERVER_ERROR_500,
                data: null
            }
        }
    },
    async deleteUserDeviceById(deviceId: AuthDevicesDbType['devices_id']): Promise<boolean> {
        return await securityRepository.deleteUserDeviceById(deviceId)
    },
    async deleteUserDeviceByIdAll(deviceId: AuthDevicesDbType['devices_id'], userId: string): Promise<boolean> {
        return await securityRepository.deleteUserDeviceByIdAll(deviceId, userId)
    },
    async updateSessionUser(requestRefreshToken: string): Promise<RequestResult<TokensResponse | false>> {
        try {
            const newTokens = await jwtService.refreshTokensJWT(requestRefreshToken)

            if (!newTokens) {
                return {
                    statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
                    data: false
                }
            }

            const { accessToken, refreshToken, refreshTokenExp } = newTokens

            const refreshTokenData = await jwtService.getDataFromRefreshToken(refreshToken)

            if (!refreshTokenData) {
                return {
                    statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
                    data: false
                }
            }

            const { userId, deviceId } = refreshTokenData

            const updatedSession = await securityRepository.updateSessionUser(userId, deviceId, refreshTokenExp)
            
            return {
                statusCode: HTTP_STATUSES.OKK_200,
                data: { accessToken, refreshToken }
            }
        } catch (error) {
            console.error('updateSessionUser', error)
            return {
                statusCode: HTTP_STATUSES.INTERNAL_SERVER_ERROR_500,
                data: false
            }
        }
    }
}