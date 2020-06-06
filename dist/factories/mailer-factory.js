"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mailgun_1 = require("ts-mailgun");
const key = 'key-411736ae5be6b1608bdc2f058b7c9509';
const domain = 'mg.webilizerr.com';
const mailer = new ts_mailgun_1.NodeMailgun(key, domain);
mailer.fromEmail = 'mailgun@mg.webilizerr.com';
mailer.fromTitle = 'Webbilizer';
mailer.init();
exports.default = mailer;
//# sourceMappingURL=mailer-factory.js.map