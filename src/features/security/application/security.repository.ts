import { ObjectId } from "mongodb";

import {authDevicesCollection} from "../../../db/db";

import {AuthDevicesDbType} from "../../../db/auth-devices-db-type";

import {DevicesSessionViewModel} from "../../../types/devices-types";

export const securityRepository = {
    async insertNewUserDevice (inputData: AuthDevicesDbType): Promise<boolean> {
        try {
            const res = await authDevicesCollection.insertOne({
                _id: new ObjectId(),
                ...inputData
            })
            return !!res.insertedId
        } catch (error) {
            console.error(`Error adding new user #${inputData.user_id} device`, error)
            return false
        }
    },
    async deleteUserDeviceById(deviceId: DevicesSessionViewModel['deviceId']): Promise<boolean> {
        try {
            const res = await authDevicesCollection.deleteOne({ devices_id: deviceId });

            return res.deletedCount === 1;
        } catch (error) {
            console.error('Error in deleteUserDeviceById:', error);
            return false;
        }
    },
    async deleteUserDeviceByIdAll(deviceId: DevicesSessionViewModel['deviceId'], userId: string): Promise<boolean> {
        try {
            const res = await authDevicesCollection.deleteMany({
                user_id: new ObjectId(userId),
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
            const res = await authDevicesCollection.updateOne({
                user_id: new ObjectId(userId),
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
            const result = await authDevicesCollection.deleteMany({});
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting all authDevices:', error);
            return false;
        }
    }
}