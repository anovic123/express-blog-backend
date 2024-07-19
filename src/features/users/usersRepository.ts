import { usersCollection } from "../../db/db";
import { UserDBType } from "../../db/user-db-type";
import { AuthInputModel, UserInputModel } from "../../input-output-types/users-types";

export const usersRepository = {
  async createUser(user: UserDBType): Promise<UserDBType> {
    const result = await usersCollection.insertOne(user)
    return user
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
        items: users
      }
    } catch (error) {
      console.log(error)
      return []
    }
  },
  async findUserByLoginOrEmail (loginOrEmail: Pick<AuthInputModel, 'loginOrEmail'>) {
    const user = await usersCollection.findOne({ $or: [ { login: loginOrEmail }, { email: loginOrEmail  } ] })

    return user
  },
  async _mapOutUser() {

  }
}