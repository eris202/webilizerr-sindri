
import { Service, Inject } from 'typedi'

@Service()
export class InvoiceController {

  viewPricingPage = (req, res) => {
    res.render('pricing')
  }

  viewCheckoutPage = (req, res) => {
    res.render('checkout')
  }

}
