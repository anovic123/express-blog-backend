import { ObjectId } from "mongodb";

import { authDevicesCollection } from "../../../db/db";

import { DevicesSessionViewModel } from "../../../types/devices-types";

import { AuthDevicesDbType } from "../../../db/auth-devices-db-type";

export const securityQueryRepository = {
    async getAllDevicesSessions(userId: ObjectId): Promise<DevicesSessionViewModel[]> {
        try {
            const devicesSessions = await authDevicesCollection.find({ user_id: userId }).toArray();

            return devicesSessions.map(this._mapDeviceSession);
        } catch (error) {
            console.error('Error in getAllDevicesSessions:', error);
            return [];
        }
    },
    async checkUserDeviceById(userId: ObjectId, deviceId: DevicesSessionViewModel['deviceId']): Promise<boolean> {
        try {
            const deviceRes = await authDevicesCollection.findOne<{ user_id: ObjectId, devices_id: string }>({ user_id: userId, devices_id: deviceId });

            return deviceRes !== null;
        } catch (error) {
            console.error('Error in checkUserDeviceById:', error);
            return false;
        }
    },
    async findUserDeviceById(deviceId: DevicesSessionViewModel['deviceId']): Promise<DevicesSessionViewModel | null> {
        try {
            const deviceRes = await authDevicesCollection.findOne(
                { devices_id: deviceId }
            );
            return deviceRes ? this._mapDeviceSession(deviceRes) : null;
        } catch (error) {
            console.error('Error in findUserDeviceById:', error);
            return null;
        }
    },
    _mapDeviceSession(deviceSession: AuthDevicesDbType): DevicesSessionViewModel {
        return {
            deviceId: deviceSession.devices_id,
            title: deviceSession.devices_name,
            lastActiveDate: deviceSession.exp,
            ip: deviceSession.ip
        };
    }
};
