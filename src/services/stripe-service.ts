import stripeClient from '../factories/stripe-client-factory'
import Stripe from 'stripe'
import { Service } from 'typedi'
import { ProductPlan } from '../factories/product-plan-factory'

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

    getDiscountPrice = async (price: number, couponId: string) => {
        try {
            const coupon = await stripeClient.coupons.retrieve(couponId)

            return {
                percentage: coupon.percent_off,
                discountPrice: (price - (price * (coupon.percent_off / 100.0))).toFixed(2)
            }
        }
        catch(e) {
            return {
                error: 'Coupon does not exist or has expired'
            }
        }
    }

    createSubscription = async (stripeCustomerId, token, planId, couponName?): Promise<Stripe.Subscription> => {
        const productConfig = ProductPlan.getProductConfig(planId)
        
        const params: Stripe.SubscriptionCreateParams = {
            customer: stripeCustomerId,
            coupon: couponName,
            items: [
                {
                    plan: productConfig.planId
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
}
