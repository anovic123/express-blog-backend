import {DevicesSessionViewModel} from "../../../types/devices-types";

import {AuthDevicesDB, AuthDevicesModel} from "../domain/device.entity";

export class SecurityQueryRepository {
    public async getAllDevicesSessions(userId: string): Promise<DevicesSessionViewModel[]> {
        try {
            const devicesSessions = await AuthDevicesModel.find({ user_id: userId }).exec();

            return devicesSessions.map(this._mapDeviceSession);
        } catch (error) {
            console.error('Error in getAllDevicesSessions:', error);
            return [];
        }
    }
    public async checkUserDeviceById(userId: string, deviceId: DevicesSessionViewModel['deviceId']): Promise<boolean> {
        try {
            const deviceRes = await AuthDevicesModel.findOne<{ user_id: string, devices_id: string }>({ user_id: userId, devices_id: deviceId }).exec();

            return deviceRes !== null;
        } catch (error) {
            console.error('Error in checkUserDeviceById:', error);
            return false;
        }
    }
    public async findUserDeviceById(deviceId: DevicesSessionViewModel['deviceId']): Promise<DevicesSessionViewModel | null> {
        try {
            const deviceRes = await AuthDevicesModel.findOne(
                { devices_id: deviceId }
            );
            return deviceRes ? this._mapDeviceSession(deviceRes) : null;
        } catch (error) {
            console.error('Error in findUserDeviceById:', error);
            return null;
        }
    }
    protected _mapDeviceSession(deviceSession: AuthDevicesDB): DevicesSessionViewModel {
        return {
            deviceId: deviceSession.devices_id,
            title: deviceSession.devices_name,
            lastActiveDate: deviceSession.exp,
            ip: deviceSession.ip
        };
    }
}