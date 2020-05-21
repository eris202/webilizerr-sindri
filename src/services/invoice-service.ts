import { Service, Inject } from "typedi";
import { StripeService } from "./stripe-service";
import User from "../model/User";

@Service()
export class InvoiceService {

    @Inject() private stripeService: StripeService

    subscribeUser = async (email: String, stripeToken: any, offerPlan: number) => {
        const dbUser = await User.findOne({
            email: email,
            isActive: true
        })

        if (!dbUser) {
            return {
                error: "The user is inactive or does not exist"
            }    
        }

        const subscription = await this.stripeService.createSubscription(dbUser.stripeCustomerId, stripeToken, offerPlan)
        dbUser.stripeSubscriptionPlanId = subscription.id

        await dbUser.save()

        return {
            redirectUrl: offerPlan === 1? '/appointment' : '/'
        }
    }
}