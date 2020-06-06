"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let ReportScoreFactory = class ReportScoreFactory {
    constructor() {
        this.getScore = (sectionName, hasPassed) => {
            if (sectionName === "performance") {
                if (hasPassed === true) {
                    return {
                        perC: 1
                    };
                }
                else if (hasPassed === false) {
                    return {
                        perW: 1
                    };
                }
            }
            else if (sectionName === "seo") {
                if (hasPassed === true) {
                    return {
                        seoC: 1
                    };
                }
                else if (hasPassed === false) {
                    return {
                        seoW: 1
                    };
                }
            }
            else if (sectionName == "social") {
                if (hasPassed == true) {
                    return {
                        socialC: 1
                    };
                }
                else if (hasPassed == false) {
                    return {
                        socialW: 1
                    };
                }
            }
            else if (sectionName === "ui") {
                if (hasPassed === true) {
                    return {
                        uiC: 1
                    };
                }
                else if (hasPassed === false) {
                    return {
                        uiW: 1
                    };
                }
            }
            else if (sectionName === "security") {
                if (hasPassed === true) {
                    return {
                        secC: 1
                    };
                }
                else if (hasPassed === false) {
                    return {
                        secW: 1
                    };
                }
            }
        };
    }
};
ReportScoreFactory = __decorate([
    typedi_1.Service()
], ReportScoreFactory);
exports.ReportScoreFactory = ReportScoreFactory;
class ReportScore {
    constructor() {
        this.perC = 0;
        this.perW = 0;
        this.seoC = 0;
        this.seoW = 0;
        this.socialC = 0;
        this.socialW = 0;
        this.uiC = 0;
        this.uiW = 0;
        this.secC = 0;
        this.secW = 0;
        this.sum = (otherScore) => {
            this.perC += otherScore.perC;
            this.perW += otherScore.perW;
            this.seoC += otherScore.seoC;
            this.seoW += otherScore.seoW;
            this.socialC += otherScore.socialC;
            this.socialW += otherScore.socialW;
            this.uiC += otherScore.uiC;
            this.uiW += otherScore.uiW;
            this.secC += otherScore.secC;
            this.secW += otherScore.secW;
        };
        this.createGrade = () => {
            const performanceGrade = Math.round(100 * (this.perC / (this.perC + this.perW)));
            const seoGrade = Math.round(100 * (this.seoC / (this.seoC + this.seoW)));
            const uiGrade = Math.round(100 * (this.uiC / (this.uiC + this.uiW)));
            const securityGrade = Math.round(100 * (this.secC / (this.secC + this.secW)));
            const socialGrade = Math.round(100 * (this.socialC / (this.socialC + this.socialW)));
            const sumOfAllGrades = (performanceGrade + seoGrade + uiGrade
                + securityGrade + socialGrade);
            const overallGrade = Math.round(sumOfAllGrades / 5);
            return new ReportGrade(performanceGrade, seoGrade, uiGrade, securityGrade, socialGrade);
        };
    }
}
exports.ReportScore = ReportScore;
class ReportGrade {
    constructor(performanceGrade, seoGrade, uiGrade, securityGrade, socialGrade) {
        this.performanceGrade = performanceGrade;
        this.seoGrade = seoGrade;
        this.uiGrade = uiGrade;
        this.securityGrade = securityGrade;
        this.socialGrade = socialGrade;
        const sumOfAllGrades = (this.performanceGrade + this.seoGrade + this.uiGrade
            + this.securityGrade + this.socialGrade);
        this.overallGrade = Math.round(sumOfAllGrades / 5);
    }
    decorateJsonWithGrades(uiModel) {
        uiModel.scores.performance.newGrade = this.performanceGrade;
        uiModel.scores.seo.newGrade = this.seoGrade;
        uiModel.scores.ui.newGrade = this.uiGrade;
        uiModel.scores.security.newGrade = this.securityGrade;
        uiModel.scores.social.newGrade = this.socialGrade;
        uiModel.scores.overall.newGrade = this.overallGrade;
    }
}
exports.ReportGrade = ReportGrade;
//# sourceMappingURL=report-score-factory.js.map