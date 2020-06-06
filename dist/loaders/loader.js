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
const dbloader_1 = __importDefault(require("./dbloader"));
const passportloader_1 = __importDefault(require("./passportloader"));
const routeloader_1 = __importDefault(require("./routeloader"));
const expressloader_1 = __importDefault(require("./expressloader"));
class AppLoader {
    static init(app) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dbloader_1.default.init(app);
            yield expressloader_1.default.init(app);
            yield passportloader_1.default.init(app);
            yield routeloader_1.default.init(app);
            console.log(`All configs are loaded`);
        });
    }
}
exports.default = AppLoader;
//# sourceMappingURL=loader.js.map