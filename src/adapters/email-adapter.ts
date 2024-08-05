import nodemailer from "nodemailer"

export const emailAdapter = {
    async sendEmail (email: string, subject: string, message: string) {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'ethanparker1q@gmail.com',
                pass: 'miok jnte phtf rfwt'
            }
        })

        await transporter.sendMail({
            from: `"Vadim" <ethanparker1q@gmail.com>`, // sender address
            to: email,
            subject,
            html: message
        })

        return {
            email,
            subject,
            message
        }
    }
}