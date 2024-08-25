import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import {add} from 'date-fns'

import {UserAccountDBType, UserAccountDocument} from "../domain/auth.entity";

import {usersRepository} from "../../users/infra/users.repository";
import {usersQueryRepository} from "../../users/infra/users-query.repository";

import {emailsManager} from "../../../managers/email.manager";
import {ObjectId} from "mongodb";

export const authService = {
    async createUser (login: string, email: string, password: string): Promise<UserAccountDBType | null> {
        const passwordHash = await this._generateHash(password)
        const user = {
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

            return createdResult
        } catch (error) {
            console.log(error)
            return null
        }
    },
    async checkCredentials (loginOrEmail: string, password: string): Promise<UserAccountDBType | null> {
        try {
            const user: UserAccountDocument | null = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
            if (!user) return null

            if (!user.emailConfirmation.isConfirmed) {
                return null
            }

            const isHashedEquals = await this._isPasswordCorrect(password, user.accountData.passwordHash)
            if (!isHashedEquals) {
                return null
            }

            return user
        } catch (error) {
            console.error(`checkCredentials for ${loginOrEmail}:`, error)
            return null
        }
    },
    async confirmEmail (code: string): Promise<boolean> {
        try {
            let user = await usersQueryRepository.findUserByConfirmationCode(code)
            if (!user) {
                return false
            }
            if (user.emailConfirmation.isConfirmed) return false
            if (user.emailConfirmation.confirmationCode !== code) return false
            if (user.emailConfirmation.expirationDate < new Date()) return false
            return await usersRepository.updateConfirmation(user._id.toString())
        } catch (error) {
            console.error(`Error in confirmEmail:`, error);
            return false
        }
    },
    async resendCode (email: string): Promise<boolean> {
        let user = await usersQueryRepository.findUserByLoginOrEmail(email)

        if (!user) return false
        try {
            const newCode = uuidv4()
            const createdResult = await usersRepository.updateUserConfirmationCode(user._id.toString(), newCode)
            await emailsManager.sendConfirmationMessage({
                _id: user._id,
                accountData: {
                    login: user.accountData.login,
                    passwordHash: user.accountData.passwordHash,
                    email: user.accountData.email,
                    createdAt: user?.accountData?.createdAt
                },
                emailConfirmation: {
                    confirmationCode: newCode,
                    expirationDate: user.emailConfirmation.expirationDate,
                    isConfirmed: user.emailConfirmation.isConfirmed
                }
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
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