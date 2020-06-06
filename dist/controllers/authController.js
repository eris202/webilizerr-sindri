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
const passport_1 = __importDefault(require("passport"));
const typedi_1 = require("typedi");
const auth_service_1 = require("../services/auth-service");
let AuthController = class AuthController {
    constructor() {
        this.postRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, password2 } = req.body;
            const userInfo = { name, email, password, password2 };
            const result = yield this.authService.registerUser(userInfo);
            if (result.errors.length > 0) {
                res.render("register", Object.assign({ error: result.errors }, userInfo));
            }
            else {
                req.flash('message', 'You have been sent an email for account confirmation');
                res.redirect("/");
            }
        });
        this.viewRegisterPage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.render("register");
        });
        this.verifyUserLink = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.query.token;
            if (!token) {
                return res.status(401).send('No token supplied');
            }
            try {
                yield this.authService.verifyUserLink(token);
                req.flash('message', 'Account has been registered successfully. Please log in now.');
                return res.redirect('/');
            }
            catch (e) {
                console.log(e);
                return res.status(401).send('Token has expired or is invalid');
            }
        });
        this.logout = (req, res) => {
            req.logout();
            req.flash('message', 'You have been logged out.');
            res.redirect('/');
        };
        this.postLogin = (req, res, next) => {
            // passport authenticate
            passport_1.default.authenticate("local", (err, user, info) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash('message', 'Invalid user name or password');
                    return res.redirect('/login');
                }
                req.login(user, info => {
                    if (info) {
                        next(info);
                    }
                    const redirectUrl = req.query.backUrl || '/';
                    req.flash('message', 'You are logged in');
                    return res.redirect(redirectUrl);
                });
            }))(req, res, next);
        };
        this.viewLoginPage = (req, res) => {
            const message = req.flash('message');
            res.render("login", {
                message: message
            });
        };
        this.postForgotPassword = (req, res) => {
            const email = req.body.email;
            if (!email) {
                return res.redirect('/forgot-password');
            }
            try {
                this.authService.resetPassword(email);
            }
            catch (e) {
                console.log(e);
            }
            finally {
                req.flash('message', `An email with instructions has been sent to your email 
      address (please also check your spam folder)`);
                res.redirect('/');
            }
        };
        this.viewForgotPasswordPage = (req, res) => {
            res.render("forgot-password");
        };
        this.viewResetPassword = (req, res) => {
            res.render('reset-password');
        };
        this.postResetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.query.token;
            const { password, repeatedPassword } = req.body;
            const result = yield this.authService.updatePassword(token, password, repeatedPassword);
            console.log(result);
            if (result.error) {
                req.flash('message', result.error);
            }
            else {
                req.flash('message', result.data);
            }
            return res.redirect('/');
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", auth_service_1.AuthService)
], AuthController.prototype, "authService", void 0);
AuthController = __decorate([
    typedi_1.Service()
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map