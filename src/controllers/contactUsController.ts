import { ContactUsRequest } from "../model/ContactRequest";
import { Service, Inject } from "typedi";
import { MailService } from "../services/mail-service";

@Service()
export class ContactUsController {
  @Inject() private mailService: MailService;

  viewContactUsForm = async (req, res) => {
    return res.render("get-in-touch");
  };

  postContactUsForm = async (req, res) => {
    const contactUsRequest = req.body as ContactUsRequest;

    this.mailService.sendContactUsRequest(contactUsRequest);

    return res.redirect("/");
  };
}
