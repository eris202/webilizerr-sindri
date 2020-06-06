"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const secureKey = 'sk_test_sWRVevQKMacfSiBdfxcRXuy4';
const publicKey = 'pk_test_lhOKm1wn446p6upD0O9WfQqD';
const stripeClient = new stripe_1.default(secureKey, {
    apiVersion: '2020-03-02',
});
exports.default = stripeClient;
//# sourceMappingURL=stripe-client-factory.js.map