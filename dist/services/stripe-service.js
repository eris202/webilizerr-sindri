"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_client_factory_1 = __importDefault(require("../factories/stripe-client-factory"));
const typedi_1 = require("typedi");
const product_plan_factory_1 = require("../factories/product-plan-factory");
let StripeService = class StripeService {
    constructor() {
        this.createCustomer = (name, email) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                name: name,
                email: email,
                description: `This is a test customer from web`
            };
            return yield stripe_client_factory_1.default.customers.create(params);
        });
        this.getDiscountPrice = (price, couponId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield stripe_client_factory_1.default.coupons.retrieve(couponId);
                return {
                    percentage: coupon.percent_off,
                    discountPrice: (price - (price * (coupon.percent_off / 100.0))).toFixed(2)
                };
            }
            catch (e) {
                return {
                    error: 'Coupon does not exist or has expired'
                };
            }
        });
        this.createPayment = (stripeCustomerId, token, planId, couponName) => __awaiter(this, void 0, void 0, function* () {
            const productConfig = product_plan_factory_1.ProductPlan.getProductConfig(planId);
            const paymentMethod = yield stripe_client_factory_1.default.paymentMethods.create({
                card: {
                    token: token,
                },
                type: 'card',
            });
            yield stripe_client_factory_1.default.paymentMethods.attach(paymentMethod.id, {
                customer: stripeCustomerId
            });
            yield stripe_client_factory_1.default.customers.update(stripeCustomerId, {
                invoice_settings: {
                    default_payment_method: paymentMethod.id,
                },
            });
            const amount = productConfig.price * 100;
            const discountPrice = yield this.getDiscountPrice(productConfig.price * 100, couponName);
            return yield stripe_client_factory_1.default.paymentIntents.create({
                payment_method: paymentMethod.id,
                amount: +(discountPrice.discountPrice || amount),
                currency: 'eur',
                confirmation_method: 'manual',
                confirm: true,
                customer: stripeCustomerId,
            });
        });
        this.createSubscription = (stripeCustomerId, token, planId, couponName) => __awaiter(this, void 0, void 0, function* () {
            const productConfig = product_plan_factory_1.ProductPlan.getProductConfig(planId);
            const params = {
                customer: stripeCustomerId,
                coupon: couponName,
                items: [
                    {
                        plan: productConfig.planId
                    }
                ]
            };
            const paymentMethod = yield stripe_client_factory_1.default.paymentMethods.create({
                card: {
                    token: token,
                },
                type: 'card',
            });
            yield stripe_client_factory_1.default.paymentMethods.attach(paymentMethod.id, {
                customer: stripeCustomerId
            });
            yield stripe_client_factory_1.default.customers.update(stripeCustomerId, {
                invoice_settings: {
                    default_payment_method: paymentMethod.id,
                },
            });
            return yield stripe_client_factory_1.default.subscriptions.create(params);
        });
    }
};
StripeService = __decorate([
    typedi_1.Service()
], StripeService);
exports.StripeService = StripeService;
//# sourceMappingURL=stripe-service.js.map