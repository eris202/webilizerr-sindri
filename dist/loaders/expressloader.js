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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path = __importStar(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const handlebars_1 = __importDefault(require("handlebars"));
const multer_1 = __importDefault(require("multer"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const change_case_1 = require("change-case");
const allow_prototype_access_1 = require("@handlebars/allow-prototype-access");
const connect_flash_1 = __importDefault(require("connect-flash"));
class ExpressViewLoader {
    static init(app) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initRequestConfigs(app);
            this.initHandleBars(app);
        });
    }
    static initRequestConfigs(app) {
        return __awaiter(this, void 0, void 0, function* () {
            // Init request attribute configs
            const callbackBasePath = process.env.BASE_HOOK;
            if (!callbackBasePath) {
                throw new Error('Base hook not defined');
            }
            console.log(callbackBasePath);
            app.use(express_1.urlencoded({ extended: false }));
            app.use(body_parser_1.default.json());
            app.use(multer_1.default().array());
            // Init static file paths
            app.use(express_1.static(path.join(__dirname, "../../src/js")));
            app.use(express_1.static(path.join(__dirname, "../../src/public")));
            // Enable flash messages
            app.use(connect_flash_1.default());
            app.use('*', (req, res, next) => {
                res.locals.absoluteUrl = `${req.protocol}://${req.get('Host')}`;
                next();
            });
        });
    }
    static initHandleBars(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const hbs = express_handlebars_1.default.create({
                layoutsDir: path.join(__dirname, "../../src/views/"),
                partialsDir: path.join(__dirname, "../../src/views/partials"),
                defaultLayout: "",
                extname: "hbs",
                handlebars: allow_prototype_access_1.allowInsecurePrototypeAccess(handlebars_1.default),
                helpers: {
                    ifeq: function (a, b, options) {
                        if (a === b) {
                            return options.fn(this);
                        }
                        return options.inverse(this);
                    },
                    ifObject: function (a, options) {
                        if (!Array.isArray(a) && typeof a === 'object') {
                            return options.fn(this);
                        }
                        return options.inverse(this);
                    },
                    ifArray: function (a, options) {
                        if (Array.isArray(a)) {
                            console.log('yes');
                            return options.fn(this);
                        }
                        return options.inverse(this);
                    },
                    numeric: function (a, options) {
                        return a ? new handlebars_1.default.SafeString(a) : 0;
                    },
                    ifString: function (a, options) {
                        if (typeof a === "string") {
                            return options.fn(this);
                        }
                        return options.inverse(this);
                    },
                    friendlyText: function (val, options) {
                        if (val) {
                            return change_case_1.capitalCase(val);
                        }
                        return "";
                    }
                }
            });
            app.engine("hbs", hbs.engine);
            app.set("view engine", "hbs");
            app.set("views", path.join(__dirname, "../../src/views"));
        });
    }
}
exports.default = ExpressViewLoader;
//# sourceMappingURL=expressloader.js.map