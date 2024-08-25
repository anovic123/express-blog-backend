import {emailAdapter} from "../adapters/email.adapter";

type EmailDto = {
    email: string
    confirmationCode: string
}

export const emailsManager =  {
    async sendConfirmationMessage({ email, confirmationCode }: EmailDto) {
        await emailAdapter.sendEmail(email, "confirmation code", confirmationCode)
    },
    async sendRecoveryMessage({ email, confirmationCode }: EmailDto) {
        return await emailAdapter.sendRecoveryEmail(email, "recoveryMessage", confirmationCode)
    }
}