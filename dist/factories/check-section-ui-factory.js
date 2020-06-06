"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let CheckSectionUiFactory = class CheckSectionUiFactory {
    constructor() {
        this.decorateDescriptionSection = (checkSection) => {
            switch (checkSection.description) {
                case true:
                    checkSection.descriptionColor = "green";
                    checkSection.descriptionCheck = "mdi-check";
                    break;
                case false:
                    checkSection.descriptionColor = "red";
                    checkSection.descriptionCheck = "mdi-close";
                    break;
            }
        };
        this.decorateTitleSection = (checkSection) => {
            switch (checkSection.title) {
                case true:
                    checkSection.titleColor = "green";
                    checkSection.titleCheck = "mdi-check";
                    break;
                case false:
                    checkSection.titleColor = "red";
                    checkSection.titleCheck = "mdi-close";
                    break;
            }
        };
        this.decorateHeaderSection = (checkSection) => {
            switch (checkSection.headers) {
                case true:
                    checkSection.headersColor = "green";
                    checkSection.headersCheck = "mdi-check";
                    break;
                case false:
                    checkSection.headersColor = "red";
                    checkSection.headersCheck = "mdi-close";
            }
        };
    }
};
CheckSectionUiFactory = __decorate([
    typedi_1.Service()
], CheckSectionUiFactory);
exports.CheckSectionUiFactory = CheckSectionUiFactory;
//# sourceMappingURL=check-section-ui-factory.js.map