import {UserAccountDBType, UserAccountDocument, UserAccountModel} from "../../auth/domain/auth.entity";

import { UserOutputType } from "../dto";

export class UsersQueryRepository {
    public async allUsers(query: any): Promise<{
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: UserOutputType[];
    } | null> {
        const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize } = query;

        const filter: any = {};

        if (searchLoginTerm) {
            filter['accountData.login'] = { $regex: searchLoginTerm, $options: 'i' };
        }

        if (searchEmailTerm) {
            filter['accountData.email'] = { $regex: searchEmailTerm, $options: 'i' };
        }

        try {
            const users = await UserAccountModel.find(filter)
                .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            const totalUsersCount = await UserAccountModel.countDocuments(filter);

            return {
                pagesCount: Math.ceil(totalUsersCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalUsersCount,
                items: users.map((user: any) => this.outputModelUser(user))
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDocument | null> {
        const user = await UserAccountModel.findOne({
            $or: [
                { 'accountData.login': loginOrEmail },
                { 'accountData.email': loginOrEmail }
            ]
        });

        return user ? (user.toObject() as UserAccountDocument) : null;
    }

    public async checkUnique(login: string, password: string): Promise<boolean> {
        const user = await UserAccountModel.findOne({
            $or: [
                { 'accountData.login': login },
                { 'accountData.password': password }
            ]
        });

        return user === null;
    }

    public async findUserById(id: string): Promise<UserAccountDBType | null> {
        const user = await UserAccountModel.findById(id);

        return user ? (user.toObject() as UserAccountDBType) : null;
    }

    public async findUserByConfirmationCode(emailConfirmationCode: string): Promise<UserAccountDocument | null> {
        const user = await UserAccountModel.findOne({ "emailConfirmation.confirmationCode": emailConfirmationCode });

        return user ? (user.toObject() as UserAccountDocument) : null;
    }

    public outputModelUser(user: UserAccountDocument | UserAccountDBType): UserOutputType {
        return {
            id: user._id.toString(),
            createdAt: user.accountData.createdAt,
            email: user.accountData.email,
            login: user.accountData.login
        };
    }
}
