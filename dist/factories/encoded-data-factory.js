"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let EncodedDataFactory = class EncodedDataFactory {
    constructor() {
        this.decorateEncodedData = (json) => {
            json.pageSize.data.mbSize = this.formatBytes(json.pageSize.data.totalSize);
            var string = json.dns.data;
            string = string.replace(/[<BR>]/g, " ");
            string = string.replace(/[br]/g, " ");
            json.dns.data = string;
            var string = json.dns.data;
            string = string.replace(/[<BR>]/g, " ");
            string = string.replace(/[br]/g, " ");
            json.dns.data = string;
        };
    }
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0)
            return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    }
};
EncodedDataFactory = __decorate([
    typedi_1.Service()
], EncodedDataFactory);
exports.EncodedDataFactory = EncodedDataFactory;
//# sourceMappingURL=encoded-data-factory.js.map