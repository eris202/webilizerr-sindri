
export class ProductPlan {
    static getProductConfig(plan: number) {
        if (plan === 0) {
            return {
                planId: 'plan_HKRp6LuMuyfGsQ',
                price: 9.99,
                name: 'Light',
                isOneTime: false
            }
        } else if (plan === 1) {
            return {
                planId: 'plan_HK0sHtauqxmO6d',
                price: 49.0,
                name: 'Business',
                isOneTime: false
            }
        } else if (plan === 2) {
            return {
                planId: 'plan_HKRsIElhfvFafk',
                price: 450.0,
                name: 'Yearly',
                isOneTime: false
            }
        } else if (plan === 3) {
            return {
                planId: '',
                price: 199.0,
                name: 'One Time',
                isOneTime: true
            }
        }

        throw new Error('Illegal State')
    }
}