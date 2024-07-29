import { ObjectId } from "mongodb";

import { usersCollection } from "../../db/db";

import { UserDBType } from "../../db/user-db-type";

import { UserOutputType } from "../../types/users-types";

export const usersRepository = {
  async createUser(user: UserDBType): Promise<UserOutputType> {
    const result = await usersCollection.insertOne(user)
    return this._outputModelUser(user)
  },
  async deleteUser(id: UserDBType['id']): Promise<boolean> {
    const user = await usersCollection.deleteOne({ id })

    return true
  },
  async deleteAll(): Promise<boolean> {
    await usersCollection.deleteMany()

    return true
  },
  _outputModelUser(user: UserDBType): UserOutputType {
    return {
      id: user.id.toString(),
      createdAt: user.createdAt,
      email: user.email,
      login: user.login
    }
  }
}