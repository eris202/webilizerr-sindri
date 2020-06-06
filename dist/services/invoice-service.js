"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const typedi_1 = require("typedi");
const stripe_service_1 = require("./stripe-service");
const User_1 = __importDefault(require("../model/User"));
const product_plan_factory_1 = require("../factories/product-plan-factory");
let InvoiceService = class InvoiceService {
    constructor() {
        this.subscribeUser = (email, stripeToken, offerPlan, couponName) => __awaiter(this, void 0, void 0, function* () {
            const dbUser = yield User_1.default.findOne({
                email: email,
                isActive: true
            });
            if (!dbUser) {
                return {
                    error: "The user is inactive or does not exist"
                };
            }
            try {
                const config = product_plan_factory_1.ProductPlan.getProductConfig(offerPlan);
                if (config.isOneTime) {
                    const paymentIntent = yield this.stripeService.createPayment(dbUser.stripeCustomerId, stripeToken, offerPlan, couponName);
                    dbUser.stripeSubscriptionPlanId = paymentIntent.id;
                }
                else {
                    const subscription = yield this.stripeService.createSubscription(dbUser.stripeCustomerId, stripeToken, offerPlan, couponName);
                    dbUser.stripeSubscriptionPlanId = subscription.id;
                }
                yield dbUser.save();
                return {
                    redirectUrl: offerPlan === 3 ? '/appointment' : '/thank-you'
                };
            }
            catch (e) {
                console.log(e);
                return {
                    error: "Please ensure you have a valid coupon by applying it again and check your credentials"
                };
            }
        });
        this.applyDiscount = (offerPlan, coupon) => __awaiter(this, void 0, void 0, function* () {
            const config = product_plan_factory_1.ProductPlan.getProductConfig(offerPlan);
            if (!coupon) {
                return {};
            }
            return yield this.stripeService.getDiscountPrice(config.price, coupon);
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", stripe_service_1.StripeService)
], InvoiceService.prototype, "stripeService", void 0);
InvoiceService = __decorate([
    typedi_1.Service()
], InvoiceService);
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoice-service.js.map