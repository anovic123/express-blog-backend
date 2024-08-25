import {AuthDevicesDB, AuthDevicesModel} from "../domain/device.entity";
import {DevicesSessionViewModel} from "../../../types/devices-types";

export const securityRepository = {
    async insertNewUserDevice (inputData: AuthDevicesDB): Promise<boolean> {
        try {
            const res = await AuthDevicesModel.insertMany({
                ...inputData
            })
            return true
        } catch (error) {
            console.error(`Error adding new user #${inputData.user_id} device`, error)
            return false
        }
    },
    async deleteUserDeviceById(deviceId: DevicesSessionViewModel['deviceId']): Promise<boolean> {
        try {
            const res = await AuthDevicesModel.deleteOne({ devices_id: deviceId });

            return res.deletedCount === 1;
        } catch (error) {
            console.error('Error in deleteUserDeviceById:', error);
            return false;
        }
    },
    async deleteUserDeviceByIdAll(deviceId: DevicesSessionViewModel['deviceId'], userId: string): Promise<boolean> {
        try {
            const res = await AuthDevicesModel.deleteMany({
                user_id: userId,
                devices_id: { $ne: deviceId }
            });

            return res.deletedCount > 0;
        } catch (error) {
            console.error('Error in deleteUserDeviceByIdAll:', error);
            return false;
        }
    },
    async updateSessionUser(userId: string, deviceId: string, refreshTokenExp: string): Promise<boolean> {
        try {
            const res = await AuthDevicesModel.updateOne({
                    user_id: userId,
                    devices_id: deviceId
                },
                {
                    $set: { exp: refreshTokenExp }
                })

            return res.modifiedCount === 1
        } catch (error) {
            console.error(`Error in updateSessionUser #${userId}`, error)
            return false
        }
    },
    async deleteAll(): Promise<boolean> {
        try {
            const result = await AuthDevicesModel.deleteMany({});
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting all authDevices:', error);
            return false;
        }
    }
}