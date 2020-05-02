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

    //Inject all factory dependencies
    @Inject() private reportUiFactory: ReportUiFactory

    @Inject() private reportScoreFactory: ReportScoreFactory

    @Inject() private checkSectionUiFactory: CheckSectionUiFactory

    @Inject() private performanceGradeUiFactory: PerformanceGradeUiFactory

    @Inject() private headerUiFactory: HeaderUiFactory

    @Inject() private malwareUiFactory: MalwareSectionUiFactory

    @Inject() private responseUiFactory: ResponseUiFactory

    @Inject() private encodedDataFactory: EncodedDataFactory

    renderReportPage = async (reportId): Promise<{
        success: any,
        status: any,
        data: any,
        reportId: any
    }> => {

        // Get response from SEO api
        console.log(seo_API_URL.seoptimerAPI + "get/" + reportId)
        const response = await axios.get(seo_API_URL.seoptimerAPI + "get/" + reportId, {
            headers: {
                "x-api-key": seo_API_KEY.seoptimerKEY,
                "Content-Type": "application/json",
            },
        })

        // If response is not success then return from here, no need to 
        // go through the resf of the code
        if (!response.data.success) {
            return {
                status: response.data.success,
                reportId: reportId,
                data: false,
                success: false
            }
        }

        // Create a model based on returning data
        const reportModel = new Report(response.data)
        const jsonn = reportModel.data.output

        // Score and grade the json data
        const score = this.calculateScoreFromJson(jsonn)
        const reportGrade: ReportGrade = score.createGrade()

        // Decorate the json object based on different performance sections
        this.performanceGradeUiFactory.decoratePerformanceSection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateSecuritySection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateSeoSection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateSocialSection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateOverallSection(jsonn, reportGrade)
        this.performanceGradeUiFactory.decorateOverallSection(jsonn, reportGrade)

        // Decorate the json object with the calculated grade
        reportGrade.decorateJsonWithGrades(jsonn)

        // Decorate UI sections of report
        this.headerUiFactory.decorateHeaderSection(jsonn)
        this.malwareUiFactory.decorateMalwareSection(jsonn)
        this.responseUiFactory.decorateResponseUiSection(jsonn)
        this.encodedDataFactory.decorateEncodedData(jsonn)

        reportModel.data.output = jsonn

        console.log('finish')
        // Return with success when everything done
        return {
            success: reportModel.success,
            status: reportModel.success,
            data: reportModel.data,
            reportId: reportId
        }
    }

    // Utility function for scoring over the response data
    private calculateScoreFromJson(json: any) {
        const score = new ReportScore()
        console.log(json)
        const temp: any = json[1];
        const responseStatus:any = json[0]
        if (responseStatus) {
            console.log(temp)
            // Creating ui sections after api
            const uiAttributes = this.reportUiFactory.getUiAttributes(temp.passed)

            temp.color = uiAttributes.color
            temp.warning = uiAttributes.warning

            // Scoring api sums based on performance on sections
            const reportScore = this.reportScoreFactory.getScore(temp.section, temp.passed)
            score.sum(reportScore)
        } else if (responseStatus == "youtubeActivity" || responseStatus == "instagramActivity") {
            score.sum({
                socialC: (temp[1]) ? 1 : 0,
                socialW: (temp[1]) ? 1 : 0
            })
        }

        if (responseStatus === "keywords") {
            if (temp == "passed") {
                console.log("PASSED");
            }

            const tem = temp['data']['keywords']

            for (let check of Object.values(tem)) {
                this.checkSectionUiFactory.decorateDescriptionSection(check)
                this.checkSectionUiFactory.decorateTitleSection(check)
                this.checkSectionUiFactory.decorateHeaderSection(check)
            }
        }

        return score
    }

    postApi = async (websiteUrl: String): Promise<ReportApiResponse> => {
        if (!websiteUrl) {
            return {
                data: "",
                errors: [
                    "Must enter a website url"
                ]
            }
        }

        const apiResponse = await axios.post(seo_API_URL + "create",
            { url: websiteUrl, pdf: 1 },
            {
                headers: {
                    "x-api-key": seo_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })

        return {
            data: apiResponse,
            errors: []
        }
    }

    getApiReport = async (reportId: number): Promise<string> => {
        try {
            const apiResponse = await axios.get(seo_API_URL + "get/" + reportId, {
                headers: {
                    "x-api-key": seo_API_KEY,
                    "Content-Type": "application/json",
                },
            })

            return apiResponse.data.success ? "ok" : "wait"
        } catch (e) {
            console.log(e)

            return e.toString()
        }
    }
}

export interface ReportApiResponse {
    data: any,
    errors: string[]
}