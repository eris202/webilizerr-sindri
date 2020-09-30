import { Service, Inject } from "typedi";
import { InvoiceService } from "../services/invoice-service";
import { ProductPlan } from "../factories/product-plan-factory";
import User from "../model/User";
import { MailService } from "../services/mail-service";

@Service()
export class InvoiceController {
  @Inject() private invoiceService: InvoiceService;

  @Inject() private mailService: MailService;

  viewPricingPage = (req, res) => {
    res.render("pricing");
  };

  viewCheckoutPage = async (req, res) => {
    const plan = +req.query.plan;
    const couponId = req.query.coupon;

    const productConfig = ProductPlan.getProductConfig(plan);
    const data = {
      price: productConfig.price,
      discountedPrice: await this.invoiceService.applyDiscount(plan, couponId),
    };

    const dbUser = await User.findOne({
      email: req.user.email,
      isActive: true,
    });

    const flashMessage = req.flash();
    console.log("Controller flash: " + JSON.stringify(productConfig));

    res.render("checkout", {
      data: data,
      message: flashMessage,
      user: dbUser,
    });
  };

  postCheckout = async (req, res) => {
    const email = req.body.email;
    const token = req.body.stripeToken;
    const plan = +req.query.plan;
    const couponName = req.query.coupon;

    const result = await this.invoiceService.subscribeUser(
      email,
      token,
      plan,
      couponName
    );

    if (result.error) {
      console.log("error in invoicecontroller: " + result.error);
      req.flash(
        "error",
        `${result.error} in our database. Be sure to use same email as is used with Webilizerr.`
      );
      console.log("req.originalUrl: " + req.originalUrl);

      return res.redirect(req.originalUrl);
    }

    const productConfig = ProductPlan.getProductConfig(plan);

    req.flash("success", `You are now using ${productConfig.name}`);

    return res.redirect(result.redirectUrl);
  };

  postAppointment = async (req, res) => {
    const {
      email,
      name,
      url,
      backendUrl,
      userName,
      userPassword,
      notes,
    } = req.body;
    const localUser = req.user;

    const user = await User.findOne({ email: localUser.email, isActive: true });

    const appointment = {
      email,
      name,
      url,
      backendUrl,
      userName,
      userPassword,
      notes,
    };

    user.appointment = appointment;

    await user.save();
    this.mailService.sendAppointmentRequest(appointment);

    return res.redirect("/");
  };
}
