import { Service, Inject } from "typedi";
import { StripeService } from "./stripe-service";
import User from "../model/User";

import { ProductPlan } from '../factories/product-plan-factory'

@Service()
export class InvoiceService {

    @Inject() private stripeService: StripeService

    subscribeUser = async (email: String, stripeToken: any, offerPlan: number, couponName: string) => {
        const dbUser = await User.findOne({
            email: email,
            isActive: true
        })

        if (!dbUser) {
            return {
                error: "The user is inactive or does not exist"
            }    
        }

        try {
            const subscription = await this.stripeService.createSubscription(dbUser.stripeCustomerId, stripeToken, offerPlan, couponName)
            dbUser.stripeSubscriptionPlanId = subscription.id

            await dbUser.save()

            return {
                redirectUrl: offerPlan === 1? '/appointment' : '/'
            }
        } catch(e) {
            console.log(e)
            return {
                error: "Please ensure you have a valid coupon by applying it again and check your credentials"
            }
        }
    }

    applyDiscount = async (offerPlan: number, coupon: string) => {
        const config = ProductPlan.getProductConfig(offerPlan)
        if (!coupon) {
            return {}
        }
        
        return await this.stripeService.getDiscountPrice(config.price, coupon)
    }
}