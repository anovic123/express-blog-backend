import {ObjectId} from "mongodb";

export type AuthDevicesDbType = {
    user_id: ObjectId
    devices_id: string
    // iat: string // issued at
    devices_name: string
    ip: string
    exp: string // expiration time
}