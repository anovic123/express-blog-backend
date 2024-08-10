import {emailAdapter} from "../adapters/email.adapter";

import {UserAccountDBType} from "../db/user-db-type";

export const emailsManager =  {
    async sendConfirmationMessage(user: UserAccountDBType) {
        await emailAdapter.sendEmail(user.accountData.email, "confirmation code", user.emailConfirmation.confirmationCode)
    }
}