import stripeClient from '../factories/stripe-client-factory'
import Stripe from 'stripe'
import { Service } from 'typedi';

@Service()
export class StripeService {

    createCustomer = async (name, email): Promise<Stripe.Customer> => {
        const params: Stripe.CustomerCreateParams = {
            name: name,
            email: email,
            description: `This is a test customer from web`
        }

        return await stripeClient.customers.create(params)
    }

    createSubscription = async (stripeCustomerId, token, planId): Promise<Stripe.Subscription> => {
        const params: Stripe.SubscriptionCreateParams = {
            customer: stripeCustomerId,
            items: [
                {
                    plan: this.getStripePlanId(planId)
                }
            ]
        }

        const paymentMethod = await stripeClient.paymentMethods.create({
            card: {
                token: token,
            },
            type: 'card',
        })

        await stripeClient.paymentMethods.attach(paymentMethod.id, {
            customer: stripeCustomerId
        })

        await stripeClient.customers.update(stripeCustomerId, {
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
            
        })

        return await stripeClient.subscriptions.create(params)
    }

    private getStripePlanId(planFlag): string {
        console.log(`Plan is: ${planFlag}`)
        if (planFlag === 0) {
            return 'plan_HJvwMXFtyiblKe'
        }

        throw new Error('Illegal State')
    }
}
