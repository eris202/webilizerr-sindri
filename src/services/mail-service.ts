import { Service, Inject } from "typedi";
import mailer from "../factories/mailer-factory";
import { TokenService } from "../services/encryption-token-service";
import { ContactUsRequest } from "../model/ContactRequest";

@Service()
export class MailService {
  @Inject() private tokenService: TokenService;

  sendAccountConfirmationEmail = async (emailAddress: string, backUrl: any) => {
    const mailOptions = {
      from: "webbilizertestapp@gmail.com",
      to: `${emailAddress}`,
      subject: "Confirmation for User Account",
      text: `Please confirm your email by clicking ${this.createConfirmationLink(
        emailAddress
      )}
            The link will be valid for 30 minutes.
            `,
    };

    mailer
      .send(
        `${emailAddress}`,
        "Email Confirmation",
        `Please confirm your email by clicking ${this.createConfirmationLink(
          emailAddress
        )}&backurl=${backUrl}
            The link will be valid for 30 minutes.
            `
      )
      .then((result) => console.log("Done", result))
      .catch((error) => console.error("Error: ", error));
  };

  sendContactUsRequest = async (contactUsRequest: ContactUsRequest) => {
    mailer
      .send(
        `${contactUsRequest.email}`,
        "Your contact request has been received",
        `
            Our customer representative will be with you soon.
        `
      )
      .then((result) => console.log("Done", result))
      .catch((error) => console.error("Error: ", error));

    mailer
      .send(
        `info@webilizerr.com`,
        `New Contact (${contactUsRequest.subject})`,
        `
            Name: ${contactUsRequest.name}

            Email: ${contactUsRequest.email}

            Phone: ${contactUsRequest.phoneNumber}

            Question: ${contactUsRequest.question}
        `
      )
      .then((result) => console.log("Done", result))
      .catch((error) => console.error("Error: ", error));
  };

  sendAppointmentRequest = async (appointmentRequest: {
    email;
    name;
    url;
    backendUrl;
    userName;
    userPassword;
    notes;
  }) => {
    mailer
      .send(
        `${appointmentRequest.email}`,
        "Your On-Page SEO order has been received",
        `
            Our SEO Expert will be with you soon.
        `
      )
      .then((result) => console.log("Done", result))
      .catch((error) => console.error("Error: ", error));

    mailer
      .send(
        `info@webilizerr.com`,
        `New Appointment Request`,
        `
            Name: ${appointmentRequest.name}

            Email: ${appointmentRequest.email}

            URL: ${appointmentRequest.url}

            Backend-URL: ${appointmentRequest.backendUrl}

            Backend-URL: ${appointmentRequest.userName}

            Backend-URL: ${appointmentRequest.userPassword}

            Notes: ${appointmentRequest.notes}
        `
      )
      .then((result) => console.log("Done", result))
      .catch((error) => console.error("Error: ", error));
  };

  sendResetLink = async (emailAddress: string) => {
    const mailOptions = {
      from: "webbilizertestapp@gmail.com",
      to: `${emailAddress}`,
      subject: "User Password Reset",
      text: `Please reset password by clicking ${this.createResetLink(
        emailAddress
      )}. The link will be valid for 30 minutes.`,
    };

    mailer
      .send(
        `${emailAddress}`,
        "User Password Reset",
        `Please reset password by clicking ${this.createResetLink(
          emailAddress
        )}. The link will be valid for 30 minutes.`
      )
      .then((result) => console.log("Done", result))
      .catch((error) => console.error("Error: ", error));
  };

  // TODO: These two can be one method
  private createConfirmationLink = (email): string => {
    return `${
      process.env.BASE_HOOK
    }/auth/verify?token=${this.tokenService.createTokenWithEmailEmbedded(
      email
    )}`;
  };

  private createResetLink = (email): string => {
    return `${
      process.env.BASE_HOOK
    }/reset-password?token=${this.tokenService.createTokenWithEmailEmbedded(
      email
    )}`;
  };
}
