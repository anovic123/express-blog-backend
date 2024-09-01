import bcrypt from "bcrypt";

import {UserAccountDBType, UserAccountDocument} from "../../auth/domain/auth.entity";

import {UsersQueryRepository} from "../infra/users-query.repository";
import {UsersRepository} from "../infra/users.repository";

export class UsersService {
    constructor(protected usersQueryRepository: UsersQueryRepository, protected usersRepository: UsersRepository) {}

    public async findUserById(id: string): Promise<UserAccountDBType | null> {
        return await this.usersQueryRepository.findUserById(id)
    }

    public async deleteUser(id: string) {
        return await this.usersRepository.deleteUser(id)
    }

    public async allUsers(query: any) {
        return await this.usersQueryRepository.allUsers(query)
    }

    public async checkUnique (login: string, password: string): Promise<boolean> {
        const res = await this.usersQueryRepository.checkUnique(login, password)

        return res
    }

    public async checkCredentials(loginOrEmail: string, password: string): Promise<UserAccountDocument | null> {
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return null

        const passwordHash = await this._generateHash(password, user.accountData.passwordHash)
        if (user.accountData.passwordHash !== passwordHash) {
            return null
        }
        return user
    }

    public async _generateHash(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}