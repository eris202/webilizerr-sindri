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
const keys_1 = require("../config/keys");
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// DB configs
class DbLoader {
    static init(app) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initializeMongoStore(app);
            yield this.initializeMongooseConnection(app);
        });
    }
    static initializeMongoStore(app) {
        const MongoDBStore = connect_mongodb_session_1.default(express_session_1.default);
        const store = new MongoDBStore({
            uri: keys_1.mongoURI,
            mongooseConnection: mongoose_1.default.connection,
            collection: "mySessions",
        });
        app.use(cookie_parser_1.default());
        app.use(express_session_1.default({
            secret: "secret",
            resave: true,
            saveUninitialized: true,
            store: store,
        }));
        // Register error handler for mongo store
        store.on("error", (error) => {
            console.log("error in STORE");
            console.log(error);
        });
    }
    // Connect to MongoDB
    static initializeMongooseConnection(app) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect(keys_1.mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("MongoDB Connected....");
        });
    }
}
exports.default = DbLoader;
//# sourceMappingURL=dbloader.js.map