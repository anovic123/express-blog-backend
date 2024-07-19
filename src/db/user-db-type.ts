import { ObjectId } from "mongodb"

export type UserDBType = {
 id: ObjectId
 login: string
 email: string
 createdAt: Date
}
