import { Service, Inject } from "typedi";
import { StripeService } from "./stripe-service";
import User from "../model/User";

import { ProductPlan } from "../factories/product-plan-factory";

@Service()
export class InvoiceService {
  @Inject() private stripeService: StripeService;

  subscribeUser = async (
    email: String,
    name: String,
    line1: string,
    line2: string,
    country: string,
    postal_code: string,
    state: string,
    city: string,
    stripeToken: any,
    offerPlan: number,
    couponName: string
  ) => {
    const dbUser = await User.findOne({
      email: email,
      isActive: true,
    });

    if (!dbUser) {
      console.log(JSON.stringify(dbUser));

      return {
        error: "The user is inactive or does not exist",
      };
    }

    try {
      console.log(`here at plan ${offerPlan}`);
      const config = ProductPlan.getProductConfig(offerPlan);
      const tempAddress = {
        line1,
        line2,
        country,
        postal_code,
        state,
        city,
      };

      if (config.isOneTime) {
        const paymentIntent = await this.stripeService.createPayment(
          dbUser.stripeCustomerId,
          email,
          stripeToken,
          offerPlan,
          couponName
        );
        dbUser.stripeSubscriptionPlanId = paymentIntent.id;
        dbUser.numOfScans += config.scanCount;
        dbUser.productPlan = offerPlan;
      } else {
        const subscription = await this.stripeService.createSubscription(
          dbUser.stripeCustomerId,
          stripeToken,
          offerPlan,
          couponName
        );
        dbUser.stripeSubscriptionPlanId = subscription.id;
        dbUser.numOfScans += config.scanCount;
        dbUser.productPlan = offerPlan;
      }

      await dbUser.save();

      return {
        redirectUrl: offerPlan === 3 ? "/appointment" : "/thank-you",
      };
    } catch (e) {
      console.log(e);
      return {
        error:
          "Please ensure you have a valid coupon by applying it again and check your credentials",
      };
    }
  };

  applyDiscount = async (offerPlan: number, coupon: string) => {
    const config = ProductPlan.getProductConfig(offerPlan);
    if (!coupon) {
      return {};
    }

    return await this.stripeService.getDiscountPrice(config.price, coupon);
  };
}
