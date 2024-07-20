import { usersCollection } from "../../db/db";
import { UserDBType } from "../../db/user-db-type";
import { UserOutputType } from "../../input-output-types/users-types";

export const usersRepository = {
  async createUser(user: UserDBType): Promise<UserOutputType> {
    const result = await usersCollection.insertOne(user)
    return this._outputModelUser(user)
  },
  async findUserById(id: UserDBType['id']): Promise<UserDBType | null> {
    const user = await usersCollection.findOne({ id })

    if (!user) {
      return null
    }

    return user
  },
  async deleteUser(id: UserDBType['id']): Promise<boolean> {
    const user = await usersCollection.deleteOne({ id })

    return true
  },
  async checkUnique(login: string, password: string): Promise<boolean> {
    const res = await usersCollection.findOne({
      $or: [
        { login: login },
        { password: password }
      ]
    });
    return res === null;
  },
  async allUsers(query: any) {
    const searchLoginTerm = query.searchLoginTerm
    const searchEmailTerm = query.searchEmailTerm

    const filter: any = {
      ...searchLoginTerm,
      ...searchEmailTerm
    }

    try {
      const users = await usersCollection.find(filter).sort(query.sortBy, query.sortDirection).skip((query.pageNumber - 1) * query.pageSize).limit(query.pageSize).toArray()

      const totalUsersCount = await usersCollection.countDocuments(filter)

      return {
        pagesCount: Math.ceil(totalUsersCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: totalUsersCount,
        items: users.map(user => this._outputModelUser(user))
      }
    } catch (error) {
      console.log(error)
      return []
    }
  },
  async findUserByLoginOrEmail (loginOrEmail: string): Promise<UserDBType | null> {
    const user = await usersCollection.findOne({
      $or: [
        { login: loginOrEmail },
        { password: loginOrEmail }
      ]
    })

    return user
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