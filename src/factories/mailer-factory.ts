import * as nodemailer from 'nodemailer'

const key = 'key-2a4b140e1677f3d2d6f10e6f7efddf2f'
const domain = 'https://app.mailgun.com/app/sending/domains/sandbox4a6ef85b353440139ed2cd8e9b70eab8.mailgun.org'

// TODO: This is for mail gun, need to setup DNS for it to work
// const mailer = new NodeMailgun(key, domain)
// mailer.fromEmail = 'postmaster@sandbox4a6ef85b353440139ed2cd8e9b70eab8.mailgun.org'
// mailer.fromTitle = 'Webbilizer'

// mailer.init();

const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'webbilizertestapp@gmail.com',
      pass: 'webbilizertestapp123'
    }
  });


export default mailer