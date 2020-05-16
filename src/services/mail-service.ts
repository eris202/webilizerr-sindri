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
            text: `Please confirm your email by clicking ${this.createConfirmationLink(emailAddress)}
            The link will be valid for 30 minutes.
            `
        };

        mailer
            .send(`${emailAddress}`, 'Email Confirmation', `Please confirm your email by clicking ${this.createConfirmationLink(emailAddress)}
            The link will be valid for 30 minutes.
            `)
            .then((result) => console.log('Done', result))
            .catch((error) => console.error('Error: ', error));
    }

    sendResetLink = async (emailAddress: string) => {

        const mailOptions = {
            from: 'webbilizertestapp@gmail.com',
            to: `${emailAddress}`,
            subject: 'User Password Reset',
            text: `Please reset password by clicking ${this.createResetLink(emailAddress)}. The link will be valid for 30 minutes.`
        };

        mailer
            .send(`${emailAddress}`, 
            'User Password Reset',
            `Please reset password by clicking ${this.createResetLink(emailAddress)}. The link will be valid for 30 minutes.`)
            .then((result) => console.log('Done', result))
            .catch((error) => console.error('Error: ', error));
    }

    // TODO: These two can be one method
    private createConfirmationLink = (email): string => {
        return `http://localhost:5555/auth/verify?token=${this.tokenService.createTokenWithEmailEmbedded(email)}`
    }

    private createResetLink = (email): string => {
        return `http://localhost:5555/reset-password?token=${this.tokenService.createTokenWithEmailEmbedded(email)}`
    }

}