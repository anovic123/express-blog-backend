import { usersRepository } from "./../features/users/usersRepository";
import { ObjectId } from "mongodb";
import { UserDBType } from "../db/user-db-type";
import bcrypt from 'bcrypt'
import { usersRepository } from "../features/users/usersRepository";

export const usersService = {
  async createUser(login: string, email: string, password: string): Promise<UserDBType> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser: UserDBType = {
      id: new ObjectId(),
      email,
      login,
      createdAt: new Date()
    }

    return usersRepository.createUser(newUser)
  },
  async findUserById(id: UserDBType['id']) {
    const userResult = await usersRepository.findUserById(id)

    return userResult
  },
  async deleteUser(id: UserDBType['id']) {
    return await usersRepository.deleteUser(id)
  },
  async allUsers(query: any) {
    return await usersRepository.allUsers(query)
  },
  async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
  },
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
}