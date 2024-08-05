import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import {UserAccountDBType} from "../../../db/user-db-type";
import {usersRepository} from "../../users/usersRepository";
import {emailsManager} from "../../../managers/email-manager";
import {usersQueryRepository} from "../../users/usersQueryRepository";

export const authService = {
    async createUser (login: string, email: string, password: string): Promise<UserAccountDBType | null> {
        const passwordHash = await this._generateHash(password)
        const user: UserAccountDBType = {
            _id: new ObjectId(),
            accountData: {
                login,
                email,
                passwordHash,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const createdResult = usersRepository.createUser(user)
        try {
            await emailsManager.sendConfirmationMessage(user)
        } catch (error) {
            console.log(error)
            return null
        }
        return createdResult
    },
    async checkCredentials (loginOrEmail: string, password: string): Promise<UserAccountDBType | null> {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return null

        if (!user.emailConfirmation.isConfirmed) {
            return null
        }

        const isHashedEquals = await this._isPasswordCorrect(password, user.accountData.passwordHash)
        if (!isHashedEquals) {
            return null
        }

        return user
    },
    async confirmEmail (code: string): Promise<boolean> {
        let user = await usersQueryRepository.findUserByConfirmationCode(code)
        if (!user) {
            return false
        }
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        const result = await usersRepository.updateConfirmation(user._id)
        return result
    },
    async resendCode (email: string): Promise<boolean> {
        let user = await usersQueryRepository.findUserByLoginOrEmail(email)

        if (!user) return false
        user
        try {
            await emailsManager.sendConfirmationMessage({
                _id: user._id,
                accountData: {
                    login: user.accountData.login,
                    passwordHash: user.accountData.passwordHash,
                    email: user.accountData.email,
                    createdAt: user.accountData.createdAt
                },
                emailConfirmation: {
                    confirmationCode: uuidv4(),
                    expirationDate: user.emailConfirmation.expirationDate,
                    isConfirmed: user.emailConfirmation.isConfirmed
                }
            })
        } catch (error) {
            console.log(error)
            return false
        }

        return true
    },
    async _isPasswordCorrect (password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    },
    async _generateHash(password: string) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}