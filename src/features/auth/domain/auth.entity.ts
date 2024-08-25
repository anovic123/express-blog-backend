import * as mongoose from 'mongoose'
import { Model, model, HydratedDocument, Types } from 'mongoose'

export type UserAccountDBType = {
    _id: Types.ObjectId
    accountData: UserAccountType
    emailConfirmation: EmailConfirmationType
}

type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
}

type UserAccountType = {
    email: string
    login: string
    passwordHash: string
    createdAt: Date
}

type UserAccountModel = Model<UserAccountDBType>

export type UserAccountDocument = HydratedDocument<UserAccountDBType>

const userAccountSchema = new mongoose.Schema<UserAccountDBType>({
    _id: {type: mongoose.Schema.Types.ObjectId},
    accountData: {
        email: { type: String, required: true },
        login: { type: String, required: true },
        passwordHash: { type: String, required: true },
        createdAt: { type: Date, required: true }
    },
    emailConfirmation: {
        isConfirmed: { type: Boolean, required: true },
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true }
    }
})

export const UserAccountModel = model<UserAccountDBType, UserAccountModel>('users', userAccountSchema)