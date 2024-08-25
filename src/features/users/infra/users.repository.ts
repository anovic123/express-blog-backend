import { Types } from 'mongoose'
import {add} from 'date-fns'

import { UserAccountDBType, UserAccountModel } from "../../auth/domain/auth.entity";

export const usersRepository = {
    async createUser(user: UserAccountDBType): Promise<UserAccountDBType | null> {
        try {
            const result = await UserAccountModel.insertMany([user])

            if (!result) {
                return null
            }

            return user;
        } catch (error) {
            console.error('Error in createUser:', error);
            return null;
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await UserAccountModel.deleteOne({ _id: new Types.ObjectId(id)});

            return result.deletedCount === 1;
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
            return false;
        }
    },
    async deleteAll(): Promise<boolean> {
        try {
            await UserAccountModel.deleteMany({});

            return true;
        } catch (error) {
            console.error('Error in deleteAll:', error);
            return false;
        }
    },
    async updateConfirmation(_id: string): Promise<boolean> {
        try {
            const result = await UserAccountModel.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });

            return result.modifiedCount === 1;
        } catch (error) {
            console.error(`Error updating confirmation for user with id ${_id}:`, error);
            return false;
        }
    },
    async updateUserConfirmationCode(_id: string, newCode: string): Promise<boolean> {
        try {
            const result = await UserAccountModel.updateOne({ _id }, { $set:
                    {
                        'emailConfirmation.confirmationCode': newCode,
                        'emailConfirmation.expirationDate': add(new Date(), {
                            hours: 1,
                            minutes: 3
                        })
                    }
            });

            return result.modifiedCount === 1;
        } catch (error) {
            console.error(`Error updating confirmation code for user with id ${_id}:`, error);
            return false;
        }
    },
    async updateUserPasswordHash(_id: Types.ObjectId, newPasswordHash: string): Promise<boolean> {
        try {
            const res = await UserAccountModel.updateOne({ _id }, {
                $set: {
                    'accountData.passwordHash': newPasswordHash,
                    'emailConfirmation.expirationDate': new Date()
                }
            })

            return res.modifiedCount === 1
        } catch (error) {
            console.error(`Error updating password hash for user with id ${_id}`, error)
            return false
        }
    }
};
