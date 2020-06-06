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
const invoice_service_1 = require("../services/invoice-service");
const product_plan_factory_1 = require("../factories/product-plan-factory");
const User_1 = __importDefault(require("../model/User"));
let InvoiceController = class InvoiceController {
    constructor() {
        this.viewPricingPage = (req, res) => {
            res.render('pricing');
        };
        this.viewCheckoutPage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const plan = +req.query.plan;
            const couponId = req.query.coupon;
            const productConfig = product_plan_factory_1.ProductPlan.getProductConfig(plan);
            const data = {
                price: productConfig.price,
                discountedPrice: yield this.invoiceService.applyDiscount(plan, couponId)
            };
            res.render('checkout', data);
        });
        this.postCheckout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const token = req.body.stripeToken;
            const plan = +req.query.plan;
            const couponName = req.query.coupon;
            const result = yield this.invoiceService.subscribeUser(email, token, plan, couponName);
            if (result.error) {
                console.log('error');
                return res.redirect(req.originalUrl);
            }
            const productConfig = product_plan_factory_1.ProductPlan.getProductConfig(plan);
            console.log('success');
            req.flash('message', `You are now using ${productConfig.name}`);
            return res.redirect(result.redirectUrl);
        });
        this.postAppointment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, name, url, backendUrl, userName, userPassword, notes } = req.body;
            const localUser = req.user;
            const user = yield User_1.default.findOne({ email: localUser.email, isActive: true });
            user.appointment = {
                email,
                name,
                url,
                backendUrl,
                userName,
                userPassword,
                notes
            };
            yield user.save();
            console.log(user.appointment);
            return res.redirect('/');
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", invoice_service_1.InvoiceService)
], InvoiceController.prototype, "invoiceService", void 0);
InvoiceController = __decorate([
    typedi_1.Service()
], InvoiceController);
exports.InvoiceController = InvoiceController;
//# sourceMappingURL=invoiceController.js.map