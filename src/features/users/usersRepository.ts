import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/db";
import { UserDBType } from "../../db/user-db-type";
import { UserOutputType } from "../../input-output-types/users-types";

export const usersRepository = {
  async createUser(user: UserDBType): Promise<UserOutputType> {
    try {
      await usersCollection.insertOne(user);
      return this._outputModelUser(user);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  },

  async findUserById(id: string): Promise<UserDBType | null> {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }
      const userId = new ObjectId(id);
      const user = await usersCollection.findOne({ _id: userId });
      return user || null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return null;
    }
  },

  async deleteUser(id: UserDBType['id']): Promise<boolean> {
    try {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  },

  async checkUnique(login: string, password: string): Promise<boolean> {
    try {
      const res = await usersCollection.findOne({
        $or: [
          { login },
          { password }
        ]
      });
      return res === null;
    } catch (error) {
      console.error("Error checking uniqueness:", error);
      return false;
    }
  },

  async allUsers(query: any) {
    const { searchLoginTerm, searchEmailTerm, sortBy = "createdAt", sortDirection = "asc", pageNumber = 1, pageSize = 10 } = query;

    const filter: any = {};
    if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm, $options: 'i' };
    }
    if (searchEmailTerm) {
      filter.email = { $regex: searchEmailTerm, $options: 'i' };
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
        pageSize,
        totalCount: totalUsersCount,
        items: users.map(user => this._outputModelUser(user))
      };
    } catch (error) {
      console.error("Error fetching all users:", error);
      return {
        pagesCount: 0,
        page: pageNumber,
        pageSize,
        totalCount: 0,
        items: []
      };
    }
  },

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    try {
      const user = await usersCollection.findOne({
        $or: [
          { login: loginOrEmail },
          { email: loginOrEmail }
        ]
      });
      return user || null;
    } catch (error) {
      console.error("Error finding user by login or email:", error);
      return null;
    }
  },

  async deleteAll(): Promise<boolean> {
    try {
      await usersCollection.deleteMany();
      return true;
    } catch (error) {
      console.error("Error deleting all users:", error);
      return false;
    }
  },

  _outputModelUser(user: UserDBType): UserOutputType {
    return {
      id: user.id.toString(),
      createdAt: user.createdAt,
      email: user.email,
      login: user.login
    };
  }
};
