"use strict";
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
const passport_local_1 = require("passport-local");
const User_1 = __importDefault(require("../model/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class PassportLoader {
    static init(app) {
        return __awaiter(this, void 0, void 0, function* () {
            // Replacing passportConfigurer(passport) with separate function
            this.initLocalStrategy(app);
            // Init serializers
            this.initUserSerializers(app);
            // Passport middleware
            app.use(passport_1.default.initialize());
            app.use(passport_1.default.session());
            // Utility to pass user session to handle bar view
            app.use((req, res, next) => {
                if (req.isAuthenticated()) {
                    res.locals.loggedIn = true;
                }
                else {
                    res.locals.loggedIn = false;
                }
                next();
            });
        });
    }
    static initLocalStrategy(app) {
        const strategyOptions = {
            usernameField: "login",
            passwordField: "password"
        };
        const verificationCallback = (email, password, done) => __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email: email, isActive: true });
            if (!user) {
                done(null, false, {
                    message: "That email is not registered",
                });
                return;
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (isMatch) {
                done(null, user);
            }
            else {
                done(null, false, {
                    message: "Password incorrect"
                });
            }
        });
        passport_1.default.use(new passport_local_1.Strategy(strategyOptions, verificationCallback));
    }
    static initUserSerializers(app) {
        passport_1.default.serializeUser((user, done) => {
            done(null, user.id);
        });
        passport_1.default.deserializeUser((id, done) => {
            User_1.default.findById(id, (err, user) => {
                done(err, user);
            });
        });
    }
}
exports.default = PassportLoader;
//# sourceMappingURL=passportloader.js.map