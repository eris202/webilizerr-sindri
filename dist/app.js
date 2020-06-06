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
// This needs to be the first line
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const loader_1 = __importDefault(require("./loaders/loader"));
const app = express_1.default();
const port = process.env.PORT || 5555;
const initAllLoaders = () => __awaiter(void 0, void 0, void 0, function* () {
    yield loader_1.default.init(app);
});
initAllLoaders().then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}).catch(er => {
    console.log(er);
});
//# sourceMappingURL=app.js.map