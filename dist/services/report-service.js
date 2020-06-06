"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const axios_1 = __importDefault(require("axios"));
const keys_1 = __importDefault(require("../config/keys"));
const keys_2 = __importDefault(require("../config/keys"));
const typedi_1 = require("typedi");
const change_case_1 = require("change-case");
const blur_keys_1 = __importDefault(require("../config/blur-keys"));
let ReportService = class ReportService {
    constructor() {
        this.renderReportPage = (reportId) => __awaiter(this, void 0, void 0, function* () {
            // Get response from SEO api
            const typedResponse = yield axios_1.default.get(keys_2.default.seoptimerAPI + "get/" + reportId, {
                headers: {
                    "x-api-key": keys_1.default.seoptimerKEY,
                    "Content-Type": "application/json",
                },
            });
            if (!typedResponse.data.success) {
                return {
                    status: typedResponse.data.success,
                    reportData: false,
                    reportId: reportId,
                    success: false,
                };
            }
            const subsections = this.divideResponseToSubsections(typedResponse.data.data.output);
            const sectionWiseData = this.createSectionWiseData(typedResponse.data.data.output, subsections);
            // Return with success when everything done
            return {
                success: true,
                status: true,
                reportData: Object.assign(Object.assign({}, sectionWiseData), { recommendations: typedResponse.data.data.output.recommendations, url: typedResponse.data.data.input.url, overall: typedResponse.data.data.output.scores.overall, screenshot: typedResponse.data.data.output.screenshot }),
                reportId: reportId,
            };
        });
        //TODO: Move to a factory
        this.createSectionWiseData = (output, subsections) => {
            const seoSection = Object.assign(Object.assign(Object.assign({}, output.scores.seo), this.computeSectionScore(subsections['seo'])), { subSections: subsections['seo'] });
            const uiSection = Object.assign(Object.assign(Object.assign({}, output.scores.ui), this.computeSectionScore(subsections['ui'])), { subSections: subsections['ui'] });
            const performanceSection = Object.assign(Object.assign(Object.assign({}, output.scores.performance), this.computeSectionScore(subsections['performance'])), { subSections: subsections['performance'] });
            const socialSection = Object.assign(Object.assign(Object.assign({}, output.scores.social), this.computeSectionScore(subsections['social'])), { subSections: subsections['social'] });
            const securitySection = Object.assign(Object.assign(Object.assign({}, output.scores.security), this.computeSectionScore(subsections['security'])), { subSections: subsections['security'] });
            const technologySection = Object.assign(Object.assign({}, this.computeSectionScore(subsections['technology'])), { subSections: subsections['technology'] });
            const overallSum = seoSection.computedScore
                + uiSection.computedScore
                + performanceSection.computedScore
                + socialSection.computedScore
                + securitySection.computedScore;
            return {
                data: {
                    seoSection,
                    uiSection,
                    performanceSection,
                    socialSection,
                    securitySection,
                    technologySection,
                },
                overallSection: {
                    score: Math.round((overallSum * 10) / 50.0)
                }
            };
        };
        this.computeSectionScore = (subsections) => {
            const total = subsections.filter(value => value.passed !== null).length;
            const passingScore = subsections
                .filter(value => value.passed !== null && value.passed)
                .map(value => 1)
                .reduce((prev, cur) => prev + cur, 0);
            const computedScore = Math.round((passingScore * 10) / total);
            return {
                computedScore,
                friendlyComputedScore: `${computedScore}`,
                colorClass: this.getColorClass(computedScore),
            };
        };
        this.getColorClass = (score) => {
            if (score < 5) {
                return 'red';
            }
            else if (score >= 5 && score < 8) {
                return 'orange';
            }
            return 'green';
        };
        this.divideResponseToSubsections = (output) => {
            const subSections = {
                'seo': [],
                'ui': [],
                'performance': [],
                'social': [],
                'security': [],
                'technology': []
            };
            for (let [key, value] of Object.entries(output)) {
                if (!value.section) {
                    continue;
                }
                subSections[value.section].push(Object.assign(Object.assign({}, value), { key: key, isBlurred: blur_keys_1.default.indexOf(key) > -1, friendlyName: change_case_1.capitalCase(key), passedClass: value.passed ? 'item-num-green' : 'item-num-red', navPassedClass: value.passed ? 'score-item-nav-green' : 'score-item-nav-red', circleTextDisplay: value.passed ? 'P' : 'F' }));
            }
            return subSections;
        };
        this.postApi = (websiteUrl) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidWebsiteUrl(websiteUrl)) {
                return {
                    error: `Invalid url ${websiteUrl}`
                };
            }
            try {
                return (yield axios_1.default.post(keys_2.default.seoptimerAPI + "create", { url: websiteUrl, pdf: 1 }, {
                    headers: {
                        "x-api-key": keys_1.default.seoptimerKEY,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                })).data;
            }
            catch (e) {
                console.log(e);
            }
        });
        this.getApiReport = (reportId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const apiResponse = yield axios_1.default.get(keys_2.default + "get/" + reportId, {
                    headers: {
                        "x-api-key": keys_1.default,
                        "Content-Type": "application/json",
                    },
                });
                return apiResponse.data.success ? "ok" : "wait";
            }
            catch (e) {
                console.log(e);
                return e.toString();
            }
        });
    }
    isValidWebsiteUrl(url) {
        const websiteRegex = /^http:\/\/www\.[a-zA-Z\d]+\.[a-zA-Z\d]+$|^https:\/\/www\.[a-zA-Z\d]+\.[a-zA-Z\d]+$/;
        return websiteRegex.test(url);
    }
};
ReportService = __decorate([
    typedi_1.Service()
], ReportService);
exports.ReportService = ReportService;
//# sourceMappingURL=report-service.js.map