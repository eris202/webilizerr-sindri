import axios from "axios"
import seo_API_KEY from "../config/keys"
import seo_API_URL from "../config/keys"
import { Service, Inject } from "typedi"
import { Output, Data } from '../model/TypedReport'
import { capitalCase } from 'change-case'
import blurredKeys from '../config/blur-keys'
import { ReportCreateResponse } from "../model/ReportCreateResponse"
import firebaseAdmin from '../config/firebase-setup'
import { ImageService } from "./image-service";

@Service()
export class ReportService {

  @Inject() private imageService: ImageService

  renderReportPage = async (
    reportId
  ): Promise<{
    success: any;
    status: any;
    reportData: any;
    reportId: any;
  }> => {

    const db = firebaseAdmin.database()
    const ref = db.ref(`reports/${reportId}`)  
    const snapshot = await ref.once('value') 
    
    const typedData = snapshot.val() as Data

    if (!typedData.output.success) {
      return {
        status: typedData.output.success,
        reportData: false,
        reportId: reportId,
        success: false,
      }
    }

    const subsections = this.divideResponseToSubsections(typedData.output)
    const sectionWiseData = this.createSectionWiseData(typedData.output, subsections)


    // Return with success when everything done
    return {
      success: true,
      status: true,
      reportData: {
        ...sectionWiseData,
        recommendations: typedData.output.recommendations,
        url: typedData.input.url,
        overall: typedData.output.scores.overall,
        screenshot: typedData.output.screenshot,
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
        passedClass: value.passed ? 'item-num-green' : 'item-num-red',
        navPassedClass: value.passed ? 'score-item-nav-green' : 'score-item-nav-red',
        circleTextDisplay: value.passed ? 'P' : 'F'
      })
    }

    return subSections
  }

  postApi = async (websiteUrl: string): Promise<ReportCreateResponse | {
    error: string
  }> => {
    if (!this.isValidWebsiteUrl(websiteUrl)) {
      return {
        error: `Invalid url ${websiteUrl}`
      }
    }

    const callbackBasePath = process.env.BASE_HOOK
    console.log(`${callbackBasePath}/hook`)
    console.log({
      url: websiteUrl,
      pdf: 1,
      callback: `${callbackBasePath}/hook`
    })
    console.log({
      "x-api-key": seo_API_KEY.seoptimerKEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
    })

    try {
      return (await axios.post<ReportCreateResponse>(
        seo_API_URL.seoptimerAPI + "create",
        {
          url: websiteUrl,
          pdf: 1,
          callback: `${callbackBasePath}/hook`
        },
        {
          headers: {
            "x-api-key": seo_API_KEY.seoptimerKEY,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      )).data

    } catch (e) {
      console.log(e)
    }

  }

  saveReport = async (data: Data) => {
    const database = firebaseAdmin.database()
    const reference = database.ref(`reports/${data.id}`)

    data.output.screenshot = await this.imageService.storeImage(data.output.screenshot, data.id)
    data.output.deviceRendering.data.mobile = await this.imageService.storeImage(data.output.deviceRendering.data.mobile, data.id)
    data.output.deviceRendering.data.tablet = await this.imageService.storeImage(data.output.deviceRendering.data.tablet, data.id)

    await reference.set(JSON.parse(JSON.stringify(data)))
  }

  private isValidWebsiteUrl(url: string) {
    const websiteRegex = /^http:\/\/www\.[a-zA-Z\d]+\.[a-zA-Z\d]+$|^https:\/\/www\.[a-zA-Z\d]+\.[a-zA-Z\d]+$/

    return websiteRegex.test(url)
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
  };
}

export interface ReportApiResponse {
  data: any
  errors: string[]
}
