import { Service, Inject } from "typedi";
import mailer from '../factories/mailer-factory'
import { TokenService } from '../services/encryption-token-service'

@Service()
export class MailService {

    @Inject() private tokenService: TokenService

    sendAccountConfirmationEmail = async (emailAddress: string) => {

        const mailOptions = {
            from: 'webbilizertestapp@gmail.com',
            to: `${emailAddress}`,
            subject: 'Confirmation for User Account',
            text: `Please confirm your email 
            by clicking 
            <a href='${this.createConfirmationLink(emailAddress)}'>
                here
            </a> <br>
            The link will be valid for 30 minutes.
            `
        };

        const info = await mailer.sendMail(mailOptions)
    }

    private createConfirmationLink = (email): string => {
        return `http://localhost:5555/auth/verify?token=${this.tokenService.createEmailConfirmationToken(email)}`
    }

}