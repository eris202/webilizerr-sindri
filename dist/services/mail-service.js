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
const mailer_factory_1 = __importDefault(require("../factories/mailer-factory"));
const encryption_token_service_1 = require("../services/encryption-token-service");
let MailService = class MailService {
    constructor() {
        this.sendAccountConfirmationEmail = (emailAddress) => __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: 'webbilizertestapp@gmail.com',
                to: `${emailAddress}`,
                subject: 'Confirmation for User Account',
                text: `Please confirm your email by clicking ${this.createConfirmationLink(emailAddress)}
            The link will be valid for 30 minutes.
            `
            };
            mailer_factory_1.default
                .send(`${emailAddress}`, 'Email Confirmation', `Please confirm your email by clicking ${this.createConfirmationLink(emailAddress)}
            The link will be valid for 30 minutes.
            `)
                .then((result) => console.log('Done', result))
                .catch((error) => console.error('Error: ', error));
        });
        this.sendResetLink = (emailAddress) => __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: 'webbilizertestapp@gmail.com',
                to: `${emailAddress}`,
                subject: 'User Password Reset',
                text: `Please reset password by clicking ${this.createResetLink(emailAddress)}. The link will be valid for 30 minutes.`
            };
            mailer_factory_1.default
                .send(`${emailAddress}`, 'User Password Reset', `Please reset password by clicking ${this.createResetLink(emailAddress)}. The link will be valid for 30 minutes.`)
                .then((result) => console.log('Done', result))
                .catch((error) => console.error('Error: ', error));
        });
        // TODO: These two can be one method
        this.createConfirmationLink = (email) => {
            return `http://localhost:5555/auth/verify?token=${this.tokenService.createTokenWithEmailEmbedded(email)}`;
        };
        this.createResetLink = (email) => {
            return `http://localhost:5555/reset-password?token=${this.tokenService.createTokenWithEmailEmbedded(email)}`;
        };
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", encryption_token_service_1.TokenService)
], MailService.prototype, "tokenService", void 0);
MailService = __decorate([
    typedi_1.Service()
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail-service.js.map