import bcrypt from "bcrypt";

import {UserAccountDBType, UserAccountDocument} from "../../auth/domain/auth.entity";

import {usersQueryRepository} from "../infra/users-query.repository";
import {usersRepository} from "../infra/users.repository";

export const usersService = {
    async findUserById(id: string): Promise<UserAccountDBType | null> {
        return await usersQueryRepository.findUserById(id)
    },
    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    },
    async allUsers(query: any) {
        return await usersQueryRepository.allUsers(query)
    },
    async checkUnique (login: string, password: string): Promise<boolean> {
        const res = await usersQueryRepository.checkUnique(login, password)

        return res
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<UserAccountDocument | null> {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return null

        const passwordHash = await this._generateHash(password, user.accountData.passwordHash)
        if (user.accountData.passwordHash !== passwordHash) {
            return null
        }
        return user
    },
    async _generateHash(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
}