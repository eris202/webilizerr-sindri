
export class ProductPlan {
    static getProductConfig(plan: number) {
        if (plan === 0) {
            return {
                planId: 'plan_HJvwMXFtyiblKe',
                price: 19.0,
                name: 'Pro'
            }
        } else if (plan === 1) {
            return {
                planId: 'plan_HK0q7OF9B51lAL',
                price: 199.0,
                name: 'Premium'
            }
        } else if (plan === 2) return {
            planId: 'plan_HK0sHtauqxmO6d',
            price: 49.0,
            name: 'Business'
        }

        throw new Error('Illegal State')
    }
}