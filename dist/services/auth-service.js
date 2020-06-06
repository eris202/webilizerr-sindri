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
const User_1 = __importDefault(require("../model/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const encryption_token_service_1 = require("./encryption-token-service");
const mail_service_1 = require("./mail-service");
const stripe_service_1 = require("./stripe-service");
let AuthService = class AuthService {
    constructor() {
        this.registerUser = (userInfo) => __awaiter(this, void 0, void 0, function* () {
            const errors = yield this.validateUserInfo(userInfo);
            if (errors.length > 0) {
                return {
                    errors,
                    data: ''
                };
            }
            return yield this.registerNewUser(userInfo);
        });
        this.validateUserInfo = (userInfo) => __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            if (!userInfo.name || !userInfo.email || !userInfo.password || !userInfo.password2) {
                errors.push({ msg: "Please fill in all the fields!" });
            }
            if (userInfo.password !== userInfo.password2) {
                errors.push({ msg: "Passwords do not match!" });
            }
            if (userInfo.password.length < 6) {
                errors.push({ msg: "Pass must be at least 6 characters" });
            }
            const re = /\S+@\S+\.\S+/;
            if (re.test(userInfo.email)) {
                const dbUser = User_1.default.findOne({
                    email: userInfo.email,
                    isActive: true
                });
                if (!dbUser) {
                    errors.push({ msg: 'Email is already registered' });
                }
            }
            else {
                errors.push({ msg: 'Please enter a valid email address' });
            }
            return errors;
        });
        this.verifyUserLink = (token) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.tokenService.getTokenPayload(token);
            const userEmail = data.email;
            const user = yield User_1.default.findOne({ email: userEmail, isActive: false });
            user.isActive = true;
            const session = yield User_1.default.startSession();
            session.startTransaction();
            try {
                const stripeCustomer = yield this.stripeService.createCustomer(user.name, userEmail);
                user.stripeCustomerId = stripeCustomer.id;
                yield user.save();
                // Deleting inactive users with same email
                yield User_1.default.deleteMany({ email: userEmail, isActive: false });
                yield session.commitTransaction();
            }
            catch (e) {
                yield session.abortTransaction();
                throw e;
            }
            finally {
                session.endSession();
            }
        });
        this.registerNewUser = (userInfo) => __awaiter(this, void 0, void 0, function* () {
            const newUser = new User_1.default({
                name: userInfo.name,
                email: userInfo.email,
                password: userInfo.password
            });
            try {
                const passwordSalt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(newUser.password, passwordSalt);
                newUser.password = hashedPassword;
                const savedUser = yield newUser.save();
                yield this.mailService.sendAccountConfirmationEmail(savedUser.email);
                return {
                    errors: [],
                    data: savedUser,
                };
            }
            catch (e) {
                console.log(e);
                return {
                    errors: [
                        {
                            msg: "Sorry, the service failed. Please try again."
                        }
                    ],
                    data: ''
                };
            }
        });
        this.resetPassword = (email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email: email, isActive: true });
            if (!user) {
                throw Error('Security issue. Trying to reset a non user');
            }
            yield this.mailService.sendResetLink(email);
        });
        this.updatePassword = (token, password, repeatedPassword) => __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                return {
                    error: 'Token is empty',
                    data: ''
                };
            }
            if (!password || !repeatedPassword) {
                return {
                    error: 'Both fields are required',
                    data: ''
                };
            }
            if (password != repeatedPassword) {
                return {
                    error: 'Passwords do not match',
                    data: ''
                };
            }
            try {
                const payload = yield this.tokenService.getTokenPayload(token);
                console.log(`payload is ${payload.email}`);
                const user = yield User_1.default.findOne({ email: payload.email, isActive: true });
                if (!user) {
                    throw new Error('Trying for an invalid user');
                }
                const passwordSalt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(password, passwordSalt);
                user.password = hashedPassword;
                yield user.save();
                return {
                    error: false,
                    data: 'Password has been updated'
                };
            }
            catch (e) {
                console.log(e);
                return {
                    error: 'Token is invalid or expired',
                    data: ''
                };
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", encryption_token_service_1.TokenService)
], AuthService.prototype, "tokenService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", mail_service_1.MailService)
], AuthService.prototype, "mailService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", stripe_service_1.StripeService)
], AuthService.prototype, "stripeService", void 0);
AuthService = __decorate([
    typedi_1.Service()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth-service.js.map