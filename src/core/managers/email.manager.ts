import {emailAdapter} from "../adapters/email.adapter";

type EmailDto = {
    email: string
    confirmationCode: string
}

export class EmailsManager  {
    public async sendConfirmationMessage({ email, confirmationCode }: EmailDto) {
        await emailAdapter.sendEmail(email, "confirmation code", confirmationCode)
    }
    public async sendRecoveryMessage({ email, confirmationCode }: EmailDto) {
        return await emailAdapter.sendRecoveryEmail(email, "recoveryMessage", confirmationCode)
    }
}

export const emailManager = new EmailsManager()