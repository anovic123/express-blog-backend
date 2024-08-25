import * as mongoose from 'mongoose'
import { Model, model, HydratedDocument, ObjectId } from "mongoose";

export type AuthDevicesDB = {
    user_id: string,
    devices_id: string
    devices_name: string
    ip: string
    exp: string
}

type AuthDevicesModel = Model<AuthDevicesDB>

export type AuthDevicesDocument = HydratedDocument<AuthDevicesDB>

const authDevicesSchema = new mongoose.Schema<AuthDevicesDB>({
    user_id: { type: String, required: true },
    devices_id: { type: String, required: true },
    devices_name: { type: String, required: true },
    ip: { type: String, required: true },
    exp: { type: String, required: true },
})

export const AuthDevicesModel = model<AuthDevicesDB, AuthDevicesModel>('auth-devices', authDevicesSchema)