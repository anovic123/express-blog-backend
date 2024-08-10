import {ObjectId} from "mongodb";

import {usersCollection} from "../../db/db";

import {UserAccountDBType} from "../../db/user-db-type";

import {UserOutputType} from "../../types/users-types";


export const usersQueryRepository = {
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
                items: users.map(user => this.outputModelUser(user))
            };
        } catch (error) {
            console.log(error);
            return [];
        }
    },
    async findUserByLoginOrEmail (loginOrEmail: string): Promise<UserAccountDBType | null> {
        const user = await usersCollection.findOne({
            $or: [
                { 'accountData.login': loginOrEmail },
                { 'accountData.email': loginOrEmail }
            ]
        })
        return user
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
    async findUserById(id: ObjectId): Promise<UserAccountDBType | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        console.log(id)
        const userId = new ObjectId(id)
        const user = await usersCollection.findOne({ _id: userId })

        if (!user) {
            return null
        }

        return user
    },
    async findUserByConfirmationCode (emailConfirmationCode: string) {
        const user = await usersCollection.findOne({ "emailConfirmation.confirmationCode": emailConfirmationCode })

        return user
    },
    outputModelUser(user: UserAccountDBType): UserOutputType {
        return {
            id: new ObjectId(user._id).toString(),
            createdAt: user.accountData.createdAt,
            email: user.accountData.email,
            login: user.accountData.login
        }
    }
}