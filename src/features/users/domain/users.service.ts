import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt'

import { usersRepository } from "../users.repository";

import {UserAccountDBType, UserDBType} from "../../../db/user-db-type";

import {usersQueryRepository} from "../users-query.repository";

export const usersService = {
  async findUserById(id: ObjectId): Promise<UserAccountDBType | null> {
    const userResult = await usersQueryRepository.findUserById(id)

    return userResult
  },
  async deleteUser(id: UserDBType['id']) {
    return await usersRepository.deleteUser(id)
  },
  async allUsers(query: any) {
    return await usersQueryRepository.allUsers(query)
  },
  async checkUnique (login: string, password: string): Promise<boolean> {
    const res = await usersQueryRepository.checkUnique(login, password)

    return res
  },
  async checkCredentials(loginOrEmail: string, password: string): Promise<UserAccountDBType | null> {
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