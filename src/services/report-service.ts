import axios from "axios";
import Report from "../model/Report";
import seo_API_KEY from '../config/keys'
import seo_API_URL from '../config/keys'
import { Service, Inject } from "typedi";
import { ReportUiFactory } from "../factories/report-ui-factory";
import { ReportScoreFactory, ReportScore, ReportGrade } from '../factories/report-score-factory'
import { CheckSectionUiFactory } from '../factories/check-section-ui-factory'
import { PerformanceGradeUiFactory } from '../factories/performance-grade-ui-section'
import { HeaderUiFactory } from "../factories/header-section-ui-factory";
import { MalwareSectionUiFactory } from "../factories/malware-section-ui-factory";
import { ResponseUiFactory } from "../factories/server-response-ui-factory";
import { EncodedDataFactory } from "../factories/encoded-data-factory";


@Service()
export class ReportService {

    @Inject() private reportUiFactory: ReportUiFactory

    @Inject() private reportScoreFactory: ReportScoreFactory

    @Inject() private checkSectionUiFactory: CheckSectionUiFactory

    @Inject() private performanceGradeUiFactory: PerformanceGradeUiFactory

    @Inject() private headerUiFactory: HeaderUiFactory

    @Inject() private malwareUiFactory: MalwareSectionUiFactory

    @Inject() private responseUiFactory: ResponseUiFactory

    @Inject() private encodedDataFactory: EncodedDataFactory

    renderReportPage = async (reportId) => {
        
        const response = await axios.get(seo_API_URL + "get/" + reportId, {
            headers: {
                "x-api-key": seo_API_KEY,
                "Content-Type": "application/json",
            },
        })

        if (!response.data.success) {
            return {
                status: response.data.success,
                reportId: reportId,
                data: false,
            }
        }

        const reportModel = new Report(response.data)
        const jsonn = reportModel.data.output

        const score = this.calculateScoreFromJson(jsonn)

        const reportGrade: ReportGrade = score.createGrade()

        this.performanceGradeUiFactory.decoratePerformanceSection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateSecuritySection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateSeoSection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateSocialSection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateOverallSection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateOverallSection(jsonn, reportGrade)

        reportGrade.decorateJsonWithGrades(jsonn)

        this.headerUiFactory.decorateHeaderSection(jsonn)
        this.malwareUiFactory.decorateMalwareSection(jsonn)
        this.responseUiFactory.decorateResponseUiSection(jsonn)
        this.encodedDataFactory.decorateEncodedData(jsonn)

        reportModel.data.output = jsonn

        return {
            success: reportModel.success,
            status: reportModel.success,
            data: reportModel.data,
        }
    }

    private calculateScoreFromJson(json: any) {
        const score = new ReportScore()

        for (let key of Object.entries(json)) {
            const temp: any = key[1];

            if (temp) {
                // Creating ui sections after api
                const uiAttributes = this.reportUiFactory.getUiAttributes(temp.passed)

                temp.color = uiAttributes.color
                temp.warning = uiAttributes.warning

                // Scoring api sums based on performance on sections
                const reportScore = this.reportScoreFactory.getScore(temp.section, temp.passed)
                score.sum(reportScore)
            } else if (key[0] == "youtubeActivity" || key[0] == "instagramActivity") {
                score.sum({
                    socialC: (key[1] === true) ? 1 : 0,
                    socialW: (key[1] === false) ? 1 : 0
                })
            }

            if (key[0] === "keywords") {
                if (temp == "passed") {
                    console.log("PASSED");
                }

                const tem = key[1]['data']['keywords']

                for (let check of Object.values(tem)) {
                    this.checkSectionUiFactory.decorateDescriptionSection(check)
                    this.checkSectionUiFactory.decorateTitleSection(check)
                    this.checkSectionUiFactory.decorateHeaderSection(check)
                }
            }
        }

        return score
    }
}