import Stripe from 'stripe'

const secureKey = 'sk_test_sWRVevQKMacfSiBdfxcRXuy4'
const publicKey = 'pk_test_lhOKm1wn446p6upD0O9WfQqD'

const stripeClient = new Stripe(secureKey, {
  apiVersion: '2020-03-02',
})

export default stripeClient