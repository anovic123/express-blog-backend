import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";

import {UserAccountDBType} from "../db/user-db-type";

import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(user: UserAccountDBType): Promise<string> {
        const token = await jwt.sign({ userId: new ObjectId(user._id).toString() }, SETTINGS.JWT_SECRET, { expiresIn: '1h' })
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}