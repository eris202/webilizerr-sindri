"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const Report_1 = __importDefault(require("../model/Report"));
const typedi_1 = require("typedi");
const report_service_1 = require("../services/report-service");
let ReportController = class ReportController {
    constructor() {
        this.renderReportPage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const reportId = req.params.reportId;
            try {
                const data = yield this.reportService.renderReportPage(reportId);
                res.render('report', data);
            }
            catch (e) {
                console.log(e);
                res.render('report', {
                    error: e
                });
            }
        });
        this.viewHomePage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const sessionId = req.sessionID;
            try {
                const report = yield Report_1.default.find({ sessionId });
                console.log(`worked ${report.sessionID}`);
            }
            catch (e) {
                console.log(e);
            }
            const flashMessage = req.flash('message');
            console.log(`flash message ${flashMessage}`);
            res.render('index', {
                message: flashMessage
            });
        });
        this.postReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const websiteUrl = req.body.url;
            const response = yield this.reportService.postApi(websiteUrl);
            if (response.data) {
                const creationResponse = response;
                if (creationResponse.success) {
                    return res.redirect(`loader?reportId=${creationResponse.data.id}`);
                }
                req.flash('message', 'There was an error connecting to our services. Please try again later');
                return res.redirect('/');
            }
            req.flash('message', 'Please post an url in the format https://www.my-awesomewebsite.com');
            return res.redirect('/');
        });
        this.viewAboutPage = (req, res) => {
            res.render("about", {
                reportId: null,
            });
        };
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", report_service_1.ReportService)
], ReportController.prototype, "reportService", void 0);
ReportController = __decorate([
    typedi_1.Service()
], ReportController);
exports.ReportController = ReportController;
//# sourceMappingURL=reportController.js.map