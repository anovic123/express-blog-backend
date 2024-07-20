import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt'

import { usersRepository } from "./../features/users/usersRepository";

import { UserDBType } from "../db/user-db-type";
import { AuthInputModel, UserOutputType } from "../input-output-types/users-types";

export const usersService = {
  async createUser(login: string, email: string, password: string): Promise<UserOutputType> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser: UserDBType = {
      id: new ObjectId(),
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date()
    }

    return await usersRepository.createUser(newUser)
  },
  async findUserById(id: string): Promise<UserDBType | null> {
    const userResult = await usersRepository.findUserById(id)

    return userResult
  },
  async deleteUser(id: UserDBType['id']) {
    return await usersRepository.deleteUser(id)
  },
  async allUsers(query: any) {
    return await usersRepository.allUsers(query)
  },
  async checkUnique (login: string, password: string): Promise<boolean> {
    const res = await usersRepository.checkUnique(login, password)

    return res
  },
  async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
    if (!user) return false
    const passwordHash = await this._generateHash(password, user.passwordSalt)
    if (user.passwordHash !== passwordHash) {
      return false
    }
    return true
  },
  async _generateHash(password: string, salt: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt)
    return hash
  },
}