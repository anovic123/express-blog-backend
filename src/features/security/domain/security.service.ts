import {AuthDevicesDbType} from "../../../db/auth-devices-db-type";
import {securityRepository} from "../application/security.repository";

export const securityService = {
    async addNewUserDevice(inputData: AuthDevicesDbType): Promise<boolean> {
        return await securityRepository.insertNewUserDevice(inputData)
    },
    async deleteUserDeviceById(deviceId: AuthDevicesDbType['devices_id']): Promise<boolean> {
        return await securityRepository.deleteUserDeviceById(deviceId)
    },
    async deleteUserDeviceByIdAll(deviceId: AuthDevicesDbType['devices_id'], userId: string): Promise<boolean> {
        return await securityRepository.deleteUserDeviceByIdAll(deviceId, userId)
    },
    async updateSessionUser(userId: string, deviceId: string, refreshTokenExp: string): Promise<boolean> {
        return await securityRepository.updateSessionUser(userId, deviceId, refreshTokenExp)
    }
}