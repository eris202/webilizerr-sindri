import { Service } from "typedi";
import { ReportGrade } from "./report-score-factory";

@Service()
export class PerformanceGradeUiFactory {

    readonly RED = "#DC143C";
    readonly YELLOW = "#FF8C00";
    readonly GREEN = "#58a193";

    decoratePerformanceSection = (json: any, reportGrade: ReportGrade) => {
        this.genericUiDecorator(json.scores.performance, reportGrade.performanceGrade)
    }

    decorateSeoSection = (json: any, reportGrade: ReportGrade) => {
        this.genericUiDecorator(json.scores.seo, reportGrade.seoGrade)

    }

    decorateUiSection = (json: any, reportGrade: ReportGrade) => {
        this.genericUiDecorator(json.scores.ui, reportGrade.uiGrade)

    }

    decorateSecuritySection = (json: any, reportGrade: ReportGrade) => {
        this.genericUiDecorator(json.scores.security, reportGrade.securityGrade)

    }

    decorateSocialSection = (json: any, reportGrade: ReportGrade) => {
        this.genericUiDecorator(json.scores.social, reportGrade.socialGrade)

    }

    decorateOverallSection = (json: any, reportGrade: ReportGrade) => {
        this.genericUiDecorator(json.scores.social, reportGrade.socialGrade)

    }

    private genericUiDecorator = (sectionObject : any, grade: number) => {
        if (grade < 50) {
            sectionObject.colorGrade = this.RED
          } else if (grade >= 50 && grade < 80) {
            sectionObject.colorGrade = this.YELLOW
          } else {
            sectionObject.colorGrade = this.GREEN
          }
    }
}