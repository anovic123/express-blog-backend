import "reflect-metadata"
import { inject, injectable } from "inversify";
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import {add} from 'date-fns'
import { Types } from 'mongoose'

import {UserAccountDBType, UserAccountDocument} from "../domain/auth.entity";

import { EmailAdapter } from "./../../../core/adapters/email.adapter";
import { EmailsManager } from "../../../core/managers/email.manager";

import { UsersRepository } from '../../users/infra/users.repository';
import { UsersQueryRepository } from "../../users/infra/users-query.repository";

import { SecurityService } from "../../security/application/security.service";

@injectable()
export class AuthService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository, 
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
        @inject(EmailAdapter) protected emailAdapter: EmailAdapter,
        @inject(EmailsManager) protected emailsManager: EmailsManager,
        @inject(SecurityService) protected securityService: SecurityService
    ) {}
    public async createUser (login: string, email: string, password: string): Promise<UserAccountDBType | null> {
        const passwordHash = await this._generateHash(password)
        const user = {
            _id: new Types.ObjectId(),
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
        const createdResult = this.usersRepository.createUser(user)
        try {
            await this.emailsManager.sendConfirmationMessage({
                email: user.accountData.email,
                confirmationCode: user.emailConfirmation.confirmationCode
            })

            return createdResult
        } catch (error) {
            console.log(error)
            return null
        }
    }

    public async checkCredentials (loginOrEmail: string, password: string): Promise<UserAccountDBType | null> {
        try {
            const user: UserAccountDocument | null = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
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
    }

    public async confirmEmail (code: string): Promise<boolean> {
        try {
            let user = await this.usersQueryRepository.findUserByConfirmationCode(code)
            if (!user) {
                return false
            }
            if (user.emailConfirmation.isConfirmed) return false
            if (user.emailConfirmation.confirmationCode !== code) return false
            if (user.emailConfirmation.expirationDate < new Date()) return false
            return await this.usersRepository.updateConfirmation(user._id.toString())
        } catch (error) {
            console.error(`Error in the confirmEmail:`, error);
            return false
        }
    }

    public async changeNewPassword ({ newPassword, recoveryCode }: { newPassword: string, recoveryCode: string }): Promise<boolean> {
       try {
           let user = await this.usersQueryRepository.findUserByConfirmationCode(recoveryCode)
           if (!user) {
               return false
           }
           if (user.emailConfirmation.confirmationCode !== recoveryCode) return false
           if (user.emailConfirmation.expirationDate < new Date()) return false


           const newPasswordHash = await this._generateHash(newPassword)

           const newPasswordHashRes = await this.usersRepository.updateUserPasswordHash(user._id, newPasswordHash)

           if (!newPasswordHash) return false

           await this.securityService.deleteUserAllSessions(user._id)
           return true
       } catch (error) {
           console.error('Error in the changeNewPassword', error)
           return false
       }
    }
    public async resendCode (email: string): Promise<boolean> {
        let user = await this.usersQueryRepository.findUserByLoginOrEmail(email)

        if (!user) return false
        try {
            const newCode = uuidv4()
            const createdResult = await this.usersRepository.updateUserConfirmationCode(user._id.toString(), newCode)
            await this.emailsManager.sendConfirmationMessage({
                email: user.accountData.email,
                confirmationCode: newCode
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    public async resendCodeForRecoveryPassword (email: string): Promise<boolean> {
        try {
            const newCode = uuidv4()

            await this.emailsManager.sendRecoveryMessage({
                email,
                confirmationCode: newCode
            })
            const user = await this.usersQueryRepository.findUserByLoginOrEmail(email)

            if (!user) return true

            const createdResult = await this.usersRepository.updateUserConfirmationCode(user._id.toString(), newCode)
            return true
        } catch (error) {
            console.error('resendCodeForRecoveryPassword', error)
            return false
        }
    }

    protected async _isPasswordCorrect (password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    }

    protected async _generateHash(password: string) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}