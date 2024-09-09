import "reflect-metadata"
import { inject, injectable } from "inversify";
import { EmailAdapter } from "../adapters/email.adapter";

type EmailDto = {
    email: string
    confirmationCode: string
}

@injectable()
export class EmailsManager  {
    constructor(@inject(EmailAdapter) protected emailAdapter: EmailAdapter) {}
    public async sendConfirmationMessage({ email, confirmationCode }: EmailDto) {
        await this.emailAdapter.sendEmail(email, "confirmation code", confirmationCode)
    }
    public async sendRecoveryMessage({ email, confirmationCode }: EmailDto) {
        return await this.emailAdapter.sendRecoveryEmail(email, "recoveryMessage", confirmationCode)
    }
}

