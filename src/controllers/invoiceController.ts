
import { Service, Inject } from 'typedi'
import { InvoiceService } from '../services/invoice-service';

@Service()
export class InvoiceController {

  @Inject() private invoiceService: InvoiceService

  viewPricingPage = (req, res) => {
    res.render('pricing')
  }

  viewCheckoutPage = (req, res) => {
    res.render('checkout')
  }

  postCheckout = async (req, res) => {
    const email = req.body.email
    const token = req.body.stripeToken
    const plan = +req.query.plan
    
    const result = await this.invoiceService.subscribeUser(email, token, plan)

    if (result.error) {
      console.log('error')
      return res.redirect(req.originalUrl)
    }
    
    console.log('success')
    req.flash('message', `You are now subscribed to ${this.getMappedProduct(plan)}`)
    
    return res.redirect(result.redirectUrl)
  }

  private getMappedProduct(plan) {
    if (plan === 0) {
      return 'Pro'
    }

    throw new Error('Illegal State')
  }

}
