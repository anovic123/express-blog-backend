import { v4 as uuidv4 } from 'uuid'
import {Types} from "mongoose";

import { UserAccountDocument } from "../../auth/domain/auth.entity";
import {AuthDevicesDB} from "../domain/device.entity";

import {jwtService} from "../../../core/services/jwt.service";

import {SecurityRepository} from "../infra/security.repository";
import {SecurityQueryRepository} from "../infra/sequrity-query.repository";

import {RequestResult} from "../../../core/request-types";

import {HTTP_STATUSES} from "../../../utils";

interface TokensResponse {
    accessToken: string
    refreshToken: string
}

export class SecurityService {
    constructor (protected securityRepository: SecurityRepository, protected securityQueryRepository: SecurityQueryRepository) {}

    public async addNewUserDevice(user: UserAccountDocument, ip: string = '0.0.0.0', userAgent: string = 'Unknown'): Promise<RequestResult<TokensResponse | null>> {
        try {
            const deviceId = uuidv4()

            const tokens = await jwtService.createJWT(user, deviceId)
            if (!tokens) {
                return {
                    statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
                    data: null
                }
            }

            await this.securityRepository.insertNewUserDevice({
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
    }
    public async deleteUserDeviceById(deviceId: AuthDevicesDB['devices_id']): Promise<boolean> {
        return await this.securityRepository.deleteUserDeviceById(deviceId)
    }
    public async deleteUserDeviceByIdAll(deviceId: AuthDevicesDB['devices_id'], userId: string): Promise<boolean> {
        return await this.securityRepository.deleteUserDeviceByIdAll(deviceId, userId)
    }
    public async deleteUserAllSessions(userId: Types.ObjectId): Promise<boolean> {
        return await this.securityRepository.deleteUserAllSessions(userId)
    }
    public async updateSessionUser(requestRefreshToken: string): Promise<RequestResult<TokensResponse | false>> {
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

            const updatedSession = await this.securityRepository.updateSessionUser(userId, deviceId, refreshTokenExp)

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