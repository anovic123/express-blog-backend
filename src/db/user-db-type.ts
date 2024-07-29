import { ObjectId, WithId } from "mongodb"

export type UserDBType = {
 id: ObjectId
 login: string
 email: string
 passwordHash: string
 passwordSalt: string
 createdAt: Date
}

export type UserAccountDBType = WithId<{
 accountData: UserAccountType
 emailConfirmation: EmailConfirmationType
}>

export type EmailConfirmationType = {
 isConfirmed: boolean
 confirmationCode: string
 expirationDate: Date
}

export type UserAccountType = {
 email: string
 login: string
 passwordHash: string
 createdAt: Date
}