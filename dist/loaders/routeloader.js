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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = require("../config/routes");
class RouteLoader {
    static init(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const router = express_1.Router();
            Object.keys(routes_1.routes).forEach(key => {
                const routeMapper = routes_1.routes[key];
                for (const mapperKey in routeMapper) {
                    console.log(`Configuring for request path: ${mapperKey}`);
                    this.populateRouterWithDefinition(mapperKey, router, routeMapper[mapperKey]);
                }
            });
            app.use('/', router);
        });
    }
    static populateRouterWithDefinition(path, router, definitions) {
        for (const definition of definitions) {
            const middleWares = definition.middleWares || [];
            switch (definition.method) {
                case 'post': {
                    router.post(path, ...middleWares, definition.handler);
                    break;
                }
                case 'get': {
                    router.get(path, ...middleWares, definition.handler);
                    break;
                }
                case 'put': {
                    router.put(path, ...middleWares, definition.handler);
                    break;
                }
                case 'delete': {
                    router.delete(path, ...middleWares, definition.handler);
                    break;
                }
                default: throw Error('Unknown method setup');
            }
        }
    }
}
exports.default = RouteLoader;
//# sourceMappingURL=routeloader.js.map