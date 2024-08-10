import { ObjectId } from "mongodb";

import { usersCollection } from "../../db/db";

import {UserAccountDBType, UserDBType} from "../../db/user-db-type";

import { UserOutputType } from "../../types/users-types";

export const usersRepository = {
  async createUser(user: any): Promise<UserAccountDBType | null> {
    const result = await usersCollection.insertOne(user)

    if (!result.insertedId) {
      return null
    }

    return user
  },
  async deleteUser(id: UserDBType['id']): Promise<boolean> {
    const user = await usersCollection.deleteOne({ id })

    return user.deletedCount === 1
  },
  async deleteAll(): Promise<boolean> {
    const result = await usersCollection.deleteMany()

    return true
  },
  async updateConfirmation(_id: ObjectId) {
    let result = await usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } })
    return result.modifiedCount === 1
  },
  async updateUserConfirmationCode(_id: ObjectId, newCode: string) {
    let result = await usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.confirmationCode': newCode } })
    return result.modifiedCount === 1
  },
  _outputModelUser(user: UserAccountDBType): UserOutputType {
    return {
      id: new ObjectId(user._id).toString(),
      createdAt: user?.accountData?.createdAt,
      email: user?.accountData?.email,
      login: user?.accountData?.login
    }
  }
}