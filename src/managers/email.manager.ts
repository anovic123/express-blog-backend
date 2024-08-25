import {emailAdapter} from "../adapters/email.adapter";

import {UserAccountDBType} from "../features/auth/domain/auth.entity";

export const emailsManager =  {
    async sendConfirmationMessage(user: UserAccountDBType) {
        await emailAdapter.sendEmail(user.accountData.email, "confirmation code", user.emailConfirmation.confirmationCode)
    }
}