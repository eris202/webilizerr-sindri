"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let HeaderUiFactory = class HeaderUiFactory {
    constructor() {
        this.decorateHeaderSection = (json) => {
            json.headers.h1count = json.headers.data.h1.length;
            json.headers.h2count = json.headers.data.h2.length;
            json.headers.h3count = json.headers.data.h3.length;
            json.headers.h4count = json.headers.data.h4.length;
            json.headers.h5count = json.headers.data.h5.length;
            json.headers.h6count = json.headers.data.h6.length;
        };
    }
};
HeaderUiFactory = __decorate([
    typedi_1.Service()
], HeaderUiFactory);
exports.HeaderUiFactory = HeaderUiFactory;
//# sourceMappingURL=header-section-ui-factory.js.map