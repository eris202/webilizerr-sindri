import { NodeMailgun } from 'ts-mailgun';

const key = 'key-411736ae5be6b1608bdc2f058b7c9509'
const domain = 'mg.webilizerr.com'

const mailer = new NodeMailgun(key, domain)
mailer.fromEmail = 'mailgun@mg.webilizerr.com'
mailer.fromTitle = 'Webbilizer'

mailer.init();

export default mailer