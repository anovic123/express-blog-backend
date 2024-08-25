import { v4 as uuidv4 } from 'uuid'
import {Types} from "mongoose";

import {UserAccountDBType, UserAccountDocument} from "../../auth/domain/auth.entity";
import {RequestResult} from "../../../types/common";
import {jwtService} from "../../auth/application/jwt.service";
import {HTTP_STATUSES} from "../../../utils";
import {securityRepository} from "../infra/security.repository";
import {AuthDevicesDB} from "../domain/device.entity";

interface TokensResponse {
    accessToken: string
    refreshToken: string
}

export const securityService = {
    async addNewUserDevice(user: UserAccountDocument, ip: string = '0.0.0.0', userAgent: string = 'Unknown'): Promise<RequestResult<TokensResponse | null>> {
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
                user_id: user._id.toString(),
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
    async deleteUserDeviceById(deviceId: AuthDevicesDB['devices_id']): Promise<boolean> {
        return await securityRepository.deleteUserDeviceById(deviceId)
    },
    async deleteUserDeviceByIdAll(deviceId: AuthDevicesDB['devices_id'], userId: string): Promise<boolean> {
        return await securityRepository.deleteUserDeviceByIdAll(deviceId, userId)
    },
    async deleteUserAllSessions(userId: Types.ObjectId): Promise<boolean> {
        return await securityRepository.deleteUserAllSessions(userId)
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