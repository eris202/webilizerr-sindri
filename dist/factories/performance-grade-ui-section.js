"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let PerformanceGradeUiFactory = class PerformanceGradeUiFactory {
    constructor() {
        this.RED = "#DC143C";
        this.YELLOW = "#FF8C00";
        this.GREEN = "#58a193";
        this.decoratePerformanceSection = (json, reportGrade) => {
            this.genericUiDecorator(json.scores.performance, reportGrade.performanceGrade);
        };
        this.decorateSeoSection = (json, reportGrade) => {
            this.genericUiDecorator(json.scores.seo, reportGrade.seoGrade);
        };
        this.decorateUiSection = (json, reportGrade) => {
            this.genericUiDecorator(json.scores.ui, reportGrade.uiGrade);
        };
        this.decorateSecuritySection = (json, reportGrade) => {
            this.genericUiDecorator(json.scores.security, reportGrade.securityGrade);
        };
        this.decorateSocialSection = (json, reportGrade) => {
            this.genericUiDecorator(json.scores.social, reportGrade.socialGrade);
        };
        this.decorateOverallSection = (json, reportGrade) => {
            this.genericUiDecorator(json.scores.social, reportGrade.socialGrade);
        };
        this.genericUiDecorator = (sectionObject, grade) => {
            if (grade < 50) {
                sectionObject.colorGrade = this.RED;
            }
            else if (grade >= 50 && grade < 80) {
                sectionObject.colorGrade = this.YELLOW;
            }
            else {
                sectionObject.colorGrade = this.GREEN;
            }
        };
    }
};
PerformanceGradeUiFactory = __decorate([
    typedi_1.Service()
], PerformanceGradeUiFactory);
exports.PerformanceGradeUiFactory = PerformanceGradeUiFactory;
//# sourceMappingURL=performance-grade-ui-section.js.map