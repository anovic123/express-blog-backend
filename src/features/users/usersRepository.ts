import { ObjectId } from "mongodb";

import { usersCollection } from "../../db/db";

import { UserDBType } from "../../db/user-db-type";

import { UserOutputType } from "../../input-output-types/users-types";

export const usersRepository = {
  async createUser(user: UserDBType): Promise<UserOutputType> {
    const result = await usersCollection.insertOne(user)
    return this._outputModelUser(user)
  },
  async findUserById(id: string): Promise<UserDBType | null> {
    if (!ObjectId.isValid(id)) {
      return null
    }
    console.log(id)
    const userId = new ObjectId(id)
    const user = await usersCollection.findOne({ id: userId })

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
    const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize } = query;

    const filter: any = {
      $or: []
    }

    if (searchLoginTerm) {
      filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }

    if (searchEmailTerm) {
      filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    if (filter.$or.length === 0) {
      delete filter.$or;
    }

    try {
      const users = await usersCollection.find(filter)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .toArray();
  
      const totalUsersCount = await usersCollection.countDocuments(filter);
  
      return {
        pagesCount: Math.ceil(totalUsersCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalUsersCount,
        items: users.map(user => this._outputModelUser(user))
      };
    } catch (error) {
      console.log(error);
      return [];
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