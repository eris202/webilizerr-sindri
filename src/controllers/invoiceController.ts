
import { Service, Inject } from 'typedi'
import { InvoiceService } from '../services/invoice-service'
import { ProductPlan } from '../factories/product-plan-factory'
import User from "../model/User"

@Service()
export class InvoiceController {

  @Inject() private invoiceService: InvoiceService

  viewPricingPage = (req, res) => {
    res.render('pricing')
  }

  viewCheckoutPage = async (req, res) => {
    const plan = +req.query.plan
    const couponId = req.query.coupon

    const productConfig = ProductPlan.getProductConfig(plan)
    const data = {
      price: productConfig.price,
      discountedPrice: await this.invoiceService.applyDiscount(plan, couponId)
    }

    res.render('checkout', data)
  }

  postCheckout = async (req, res) => {
    const email = req.body.email
    const token = req.body.stripeToken
    const plan = +req.query.plan
    const couponName = req.query.coupon
    
    const result = await this.invoiceService.subscribeUser(email, token, plan, couponName)

    if (result.error) {
      console.log('error')
      return res.redirect(req.originalUrl)
    }

    const productConfig = ProductPlan.getProductConfig(plan)
    
    console.log('success')
    req.flash('message', `You are now using ${productConfig.name}`)
    
    return res.redirect(result.redirectUrl)
  }

  postAppointment = async (req, res) => {
    const {email, name, url, backendUrl, userName, userPassword, notes} = req.body
    const localUser = req.user

    const user = await User.findOne({ email: localUser.email, isActive: true })
    user.appointment = {
      email,
      name,
      url,
      backendUrl,
      userName,
      userPassword,
      notes
    }

    await user.save()
    console.log(user.appointment)

    return res.redirect('/')
  }
}