import axios from "axios"
import seo_API_KEY from "../config/keys"
import seo_API_URL from "../config/keys"
import { Service } from "typedi"
import { TypedReport, Output } from '../model/TypedReport'
import {capitalCase} from 'change-case'
import blurredKeys from '../config/blur-keys'

@Service()
export class ReportService {

  renderReportPage = async (
    reportId
  ): Promise<{
    success: any;
    status: any;
    reportData: any;
    reportId: any;
  }> => {
    // Get response from SEO api
    const typedResponse = await axios.get<TypedReport>(
      seo_API_URL.seoptimerAPI + "get/" + reportId,
      {
        headers: {
          "x-api-key": seo_API_KEY.seoptimerKEY,
          "Content-Type": "application/json",
        },
      }
    )

    if (!typedResponse.data.success) {
      return {
        status: typedResponse.data.success,
        reportData: false,
        reportId: reportId,
        success: false,
      }
    }

    const subsections = this.divideResponseToSubsections(typedResponse.data.data.output)
    const sectionWiseData = this.createSectionWiseData(typedResponse.data.data.output, subsections)


    // Return with success when everything done
    return {
      success: true,
      status: true,
      reportData: {
        ...sectionWiseData,
        recommendations: typedResponse.data.data.output.recommendations,
        url: typedResponse.data.data.input.url,
        overall: typedResponse.data.data.output.scores.overall,
        screenshot: typedResponse.data.data.output.screenshot,
      },
      reportId: reportId,
    }
  }

  //TODO: Move to a factory
  private createSectionWiseData = (output: Output, subsections) => {
    const seoSection = {
      ...output.scores.seo,
      ...this.computeSectionScore(subsections['seo']),
      subSections: subsections['seo'],
    }

    const uiSection = {
      ...output.scores.ui,
      ...this.computeSectionScore(subsections['ui']),
      subSections: subsections['ui'],
    }

    const performanceSection = {
      ...output.scores.performance,
      ...this.computeSectionScore(subsections['performance']),
      subSections: subsections['performance'],
    }

    const socialSection = {
      ...output.scores.social,
      ...this.computeSectionScore(subsections['social']),
      subSections: subsections['social'],
    }

    const securitySection = {
      ...output.scores.security,
      ...this.computeSectionScore(subsections['security']),
      subSections: subsections['security'],
    }

    const technologySection = {
      ...this.computeSectionScore(subsections['technology']),
      subSections: subsections['technology'],
    }

    const overallSum = seoSection.computedScore 
                        + uiSection.computedScore 
                        + performanceSection.computedScore
                        + socialSection.computedScore 
                        + securitySection.computedScore
    
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
    }
  }

  private computeSectionScore = (subsections: any[]) => {
    const total = subsections.filter(value => value.passed !== null).length
    const passingScore = subsections
                            .filter(value => value.passed !== null && value.passed)
                            .map(value => 1)
                            .reduce((prev, cur) => prev + cur, 0)
    
    const computedScore = Math.round((passingScore * 10) / total)

    return {
      computedScore,
      friendlyComputedScore: `${computedScore}`,
      colorClass: this.getColorClass(computedScore),
    }
  }

  private getColorClass = (score) => {
    if (score < 5) {
      return 'red'
    } else if (score >= 5 && score < 8) {
      return 'orange'
    }
    
    return 'green'
  }

  private divideResponseToSubsections = (output: Output) => {
    const subSections = {
      'seo': [],
      'ui': [],
      'performance': [],
      'social': [],
      'security': [],
      'technology': []
    }

    for (let [key, value] of Object.entries(output)) {
      if (!value.section) {
        continue
      }

      subSections[value.section].push({
        ...value,
        key: key,
        isBlurred: blurredKeys.indexOf(key) > -1,
        friendlyName: capitalCase(key),
        passedClass: value.passed? 'item-num-green' : 'item-num-red',
        navPassedClass: value.passed? 'score-item-nav-green' : 'score-item-nav-red',
        circleTextDisplay:  value.passed? 'P' : 'F'
      })
    }

    return subSections
  }

  postApi = async (websiteUrl: String): Promise<ReportApiResponse> => {
    if (!websiteUrl) {
      return {
        data: "",
        errors: ["Must enter a website url"],
      };
    }

    const apiResponse = await axios.post(
      seo_API_URL + "create",
      { url: websiteUrl, pdf: 1 },
      {
        headers: {
          "x-api-key": seo_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return {
      data: apiResponse,
      errors: [],
    };
  };

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
  };
}

export interface ReportApiResponse {
  data: any
  errors: string[]
}
