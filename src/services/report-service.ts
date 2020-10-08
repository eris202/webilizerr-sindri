import axios from "axios";
import seo_API_KEY from "../config/keys";
import seo_API_URL from "../config/keys";
import { Service, Inject } from "typedi";
import { Output, Data, RecentReport } from "../model/TypedReport";
import { capitalCase, capitalCaseTransform } from "change-case";
import blurredKeys from "../config/blur-keys";
import { ReportCreateResponse } from "../model/ReportCreateResponse";
import firebaseAdmin from "../config/firebase-setup";
import { ImageService } from "./image-service";
import * as timeAgo from "time-ago";
import User from "../model/User";
import { userInfo } from "os";
import { database } from "firebase-admin";

@Service()
export class ReportService {
  @Inject() private imageService: ImageService;

  renderServicePage = async (
    user
  ): Promise<{
    reportData: any;
  }> => {
    const db = firebaseAdmin.database();
    const ref = db
      .ref(`reports`)
      .orderByChild(`generatedByUser/email`)
      .equalTo(`55@55.is`)
      .limitToLast(1);

    const snapshot = await ref.once("value");
    let typedData = snapshot.val() as Data;

    if (typedData) {
      return {
        reportData: typedData,
      };
    } else {
      return;
    }
  };
  renderReportPage = async (
    reportId,
    user
  ): Promise<{
    success: any;
    status: any;
    reportData: any;
    reportId: any;
    blurr: boolean;
  }> => {
    const db = firebaseAdmin.database();
    const ref = db.ref(`reports/${reportId}`);
    const snapshot = await ref.once("value");
    let blurr = false;

    const typedData = snapshot.val() as Data;
    console.log(
      "typedData.generatedByUser: " +
        JSON.stringify(typedData.generatedByUser.email)
    );

    if (!typedData.output.success) {
      return {
        status: typedData.output.success,
        reportData: false,
        reportId: reportId,
        success: false,
        blurr: false,
      };
    } else if (!typedData.output.success == null) {
      console.log("Unable to get report, Report-Service");
    }
    if (typeof user == "undefined") {
      blurr = true;
    } else {
      blurr = false;
    }

    const subsections = this.divideResponseToSubsections(
      typedData.output,
      user
    );

    const sectionWiseData = this.createSectionWiseData(
      typedData.output,
      subsections,
      blurr
    );

    if (user && !typedData.generatedByUser.email) {
      const dbUser = await User.findOne({
        email: user.email,
        isActive: true,
      });
      if (dbUser) {
        typedData.generatedByUser = {
          email: dbUser.email,
          name: dbUser.name,
          id: dbUser.id,
          isActive: dbUser.isActive,
        };
        console.log("Saving user to a report..");
        // TODO
        dbUser.numOfScans = Math.max(0, dbUser.numOfScans - 1);
        console.log("decreasing number of scanns: " + dbUser.numOfScans);
        await dbUser.save();
        ref.update(typedData);
      }
    }

    ref.update(typedData);

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
      blurr: blurr,
    };
  };

  //TODO: Move to a factory
  private createSectionWiseData = (
    output: Output,
    subsections,
    blur: boolean
  ) => {
    const seoSection = {
      ...output.scores.seo,
      ...this.computeSectionScore(output.scores.seo, subsections["seo"], blur),
      subSections: subsections["seo"],
    };

    const uiSection = {
      ...output.scores.ui,
      ...this.computeSectionScore(output.scores.ui, subsections["ui"], blur),
      subSections: subsections["ui"],
    };

    const performanceSection = {
      ...output.scores.performance,
      ...this.computeSectionScore(
        output.scores.performance,
        subsections["performance"],
        blur
      ),
      subSections: subsections["performance"],
    };

    const socialSection = {
      ...output.scores.social,
      ...this.computeSectionScore(
        output.scores.social,
        subsections["social"],
        blur
      ),
      subSections: subsections["social"],
    };

    const securitySection = {
      ...output.scores.security,
      ...this.computeSectionScore(
        output.scores.security,
        subsections["security"],
        blur
      ),
      subSections: subsections["security"],
    };

    const technologySection = {
      ...this.computeSectionScore(output, subsections["technology"], blur),
      subSections: subsections["technology"],
    };

    const overallSum = output.scores.overall.grade;
    let colorClass = this.getColorClass(overallSum);

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
        score: overallSum,
        colorClass: colorClass,
      },
    };
  };

  private computeSectionScore = (output, subsections: any[], blur: boolean) => {
    // We used to need to create our own grades but now it comes with the API
    //const total = subsections.filter((value) => value.passed !== null).length;

    // console.log("total: " + total + subsections);
    // const passingScore = subsections
    //   .filter((value) => value.passed !== null && value.passed)
    //   .map((value) => 1)
    //   .reduce((prev, cur) => prev + cur, 0);
    // console.log("passingScore: " + passingScore + subsections);

    if (blur) {
      const computedScore = Math.random() * (65 - 35) + 35;
      const score = computedScore.toFixed(0);

      return {
        computedScore,
        friendlyComputedScore: `${score}`,
        colorClass: this.getColorClass(score),
      };
    }

    const computedScore = parseFloat(output.grade);
    return {
      computedScore,
      friendlyComputedScore: `${computedScore}`,
      colorClass: this.getColorClass(computedScore),
    };
  };

  private getColorClass = (score) => {
    if (score < 50) {
      return "red";
    } else if (score >= 50 && score < 80) {
      return "orange";
    }

    return "green";
  };

  private divideResponseToSubsections = (output: Output, user: any) => {
    const subSections = {
      seo: [],
      ui: [],
      performance: [],
      social: [],
      security: [],
      technology: [],
    };
    let blurrKey = false;

    if (typeof user == "undefined") {
      blurrKey = true;
      for (let [key, value] of Object.entries(output)) {
        if (!value.section) {
          continue;
        }
        subSections[value.section].push({
          ...value,
          key: key,

          isBlurred: blurrKey,

          friendlyName: this.changeKeyName(key),
          passedClass: String(this.IfNullColor(value, blurrKey)),
          circleTextDisplay: String(this.IfNullSign(value, blurrKey)),
          formatChanged: String(this.subsectionChangeFormat(key, value)),
          navPassedClass: value.passed
            ? "score-item-nav-green"
            : "score-item-nav-red",
          // passedClass: value.passed ? "item-num-green" : "item-num-red",
          // circleTextDisplay: value.passed ? "✔" : "✘",
        });
      }
    } else {
      blurrKey = false;
    }

    for (let [key, value] of Object.entries(output)) {
      if (!value.section) {
        continue;
      }

      // if (typeof user == "undefined" && blurredKeys.indexOf(key) > -1) {
      //   console.log(
      //     "blurr 1: " + JSON.stringify(key) + " " + JSON.stringify(value)
      //   );
      //   blurrKey = true;
      // } else {
      //   blurrKey = false;
      // }

      subSections[value.section].push({
        ...value,
        key: key,

        isBlurred: blurrKey,

        friendlyName: this.changeKeyName(key),
        passedClass: String(this.IfNullColor(value, blurrKey)),
        circleTextDisplay: String(this.IfNullSign(value, blurrKey)),
        formatChanged: String(this.subsectionChangeFormat(key, value)),
        navPassedClass: value.passed
          ? "score-item-nav-green"
          : "score-item-nav-red",
        // passedClass: value.passed ? "item-num-green" : "item-num-red",
        // circleTextDisplay: value.passed ? "✔" : "✘",
      });
    }
    return subSections;
  };

  // TODO Change pageSize so we can use numbers rolling in UI and "mb" "kb" own property behind.
  private subsectionChangeFormat(key: any, value: any) {
    if (key.toLowerCase() === "backlinks") {
      value.data.backlinks = value.data.backlinks
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
    if (key === "pageSize" && !isNaN(value.data.totalSize)) {
      const obj = value.data;
      //this.formatByteToMB(obj);

      for (let key in obj) {
        obj[key] = this.formatByteToMB(obj[key]);
      }
    } else {
    }
  }
  e;

  private formatByteToMB(data: any) {
    if (data === 0) {
      return (data = "0 Bytes");
    }

    const decimals = 2;
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(data) / Math.log(k));
    return parseFloat((data / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  private IfNullColor(value: any, blurr: any) {
    if (blurr) {
      return "item-num-yellow";
    } else {
      if (value.passed === undefined) {
        return "item-num-orange";
      } else if (value.passed) {
        return "item-num-green";
      } else if (!value.passed) {
        return "item-num-red";
      }
    }
  }

  private IfNullSign(value: any, blurr: any) {
    if (blurr) {
      return "?";
    } else {
      if (value.passed === undefined) {
        return "𝓲";
      } else if (value.passed) {
        return "✔";
      } else {
        return "✘";
      }
    }
  }

  private changeKeyName(key: string) {
    if (key.toLowerCase() === "analytics") {
      return "Analytics";
    } else if (key.toLowerCase() === "robotstxt") {
      return "Robots.txt";
    } else if (key.toLowerCase() === "contentlength") {
      return "Amount of Content";
    } else if (key.toLowerCase() === "description") {
      return "Meta Description";
    } else if (key.toLowerCase() === "headers") {
      return "Headings";
    } else if (key.toLowerCase() === "noindexheaders") {
      return "No Index Headers";
    } else if (key.toLowerCase() === "schemaorg") {
      return "Schema.org";
    } else if (key.toLowerCase() === "sitemap") {
      return "XML Sitemap";
    } else if (key.toLowerCase() === "title") {
      return "Title Tag";
    } else if (key.toLowerCase() === "iframe") {
      return "iFrames";
    } else if (key.toLowerCase() === "legiblefonts") {
      return "Font Size Legibility";
    } else if (key.toLowerCase() === "deprecated") {
      return "Deprecated HTML Tags";
    } else if (key.toLowerCase() === "gzip") {
      return "GZIP Compression";
    } else if (key.toLowerCase() === "inlineCss") {
      return "Inline CSS";
    } else if (key.toLowerCase() === "minified") {
      return "Minified JavaScript and CSS ";
    } else if (key.toLowerCase() === "optimizedImages") {
      return "Image Optimization";
    } else if (key.toLowerCase() === "linkedInLink") {
      return "Linkedin Link";
    } else if (key.toLowerCase() === "twitterTags") {
      return "Twitter Cards";
    } else if (key.toLowerCase() === "email") {
      return "Email Privacy";
    } else if (key.toLowerCase() === "httpsRedirect") {
      return "URL Resolve";
    } else if (key.toLowerCase() === "Malware") {
      return "Malware Scanners";
    } else if (key.toLowerCase() === "ip") {
      return "Service IP Address";
    } else if (key.toLowerCase() === "dns") {
      return "DNS";
    }

    return capitalCase(key);
  }

  isUserAuthorizedForGeneratingReport = async (user) => {
    if (!user) {
      return true;
    }

    const dbUser = await User.findOne({
      email: user.email,
      isActive: true,
    });

    return dbUser.numOfScans > 0;
  };

  postApi = async (
    websiteUrl: string,
    user
  ): Promise<
    | ReportCreateResponse
    | {
        error: string;
      }
  > => {
    if (!this.isValidWebsiteUrl(websiteUrl)) {
      return {
        error: `Invalid url format: ${websiteUrl}`,
      };
    } else if (!(await this.isUserAuthorizedForGeneratingReport(user))) {
      return {
        error: `You have no scans left.`,
      };
    }

    const callbackBasePath = process.env.BASE_HOOK;

    try {
      return (
        await axios.post<ReportCreateResponse>(
          seo_API_URL.seoptimerAPI + "create",
          {
            url: websiteUrl,
            pdf: 1,
            callback: `${callbackBasePath}/hook`,
          },
          {
            headers: {
              "x-api-key": seo_API_KEY.seoptimerKEY,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
      ).data;
    } catch (e) {
      console.log(e);
    }
  };

  getMyScannedReport = async (pageNum: number, user: any) => {
    const fetch_reports = 100;
    const database = firebaseAdmin.database();
    const reference = database.ref(`reports`);
    const recentlyScannedQuery = await reference
      .orderByChild("generatedByUser/email")
      .equalTo(`${user.email}`)
      .limitToFirst(100)
      .once("value");

    if (!recentlyScannedQuery) {
      return {};
    }
    const reportArray: RecentReport[] = [];
    console.log(user.email + " is fetching my-report");
    const recentlyScannedList = recentlyScannedQuery.exportVal();
    if (recentlyScannedList != null) {
      let keyList = Object.keys(recentlyScannedList);
      var n = 1; //get the first 5 items
      keyList = keyList.slice(Math.max(keyList.length - fetch_reports, 0));

      for (var property in keyList) {
        if (keyList.hasOwnProperty(property) && n <= fetch_reports) {
          const modal = {} as RecentReport;
          let keyName = keyList[keyList.length - n];

          let data = recentlyScannedList[keyName] as Data;
          const subsections = this.divideResponseToSubsections(
            data.output,
            user
          );
          const score = this.createSectionWiseData(
            data.output,
            subsections,
            null
          );

          modal.id = data.id;
          modal.score = data.output.scores.overall.grade;
          (modal.timeAgo = timeAgo.ago(
            new Date(data.hookedTime ? data.hookedTime : data.completed_at)
          )),
            (modal.url = this.createValidUrl(data.input.url));
          modal.url = modal.url.replace(/^(?:https?:\/\/)?/i, "").split("/")[0];
          modal.color1 = this.getRecentReportColor(modal);

          reportArray.splice(reportArray.length, 0, modal);
        }
        n++;
      }
      return reportArray;
    }
    return {};
  };

  getRecentlyScannedReport = async (pageNum: number) => {
    const database = firebaseAdmin.database();
    const reference = database.ref(`reports`);

    const recentlyScannedList = (
      await reference.orderByKey().limitToFirst(100).once("value")
    ).exportVal();
    if (!recentlyScannedList) {
      return {};
    }

    const reportArray: RecentReport[] = [];
    let keyList = Object.keys(recentlyScannedList);
    var n = 0; //get the first 5 items

    keyList = keyList.slice(Math.max(keyList.length - 50, 1));

    for (var property in keyList) {
      n = n + 1;
      if (keyList.hasOwnProperty(property) && n <= 50) {
        const modal = {} as RecentReport;
        let keyName = keyList[keyList.length - n];
        let data = recentlyScannedList[keyName] as Data;
        const subsections = this.divideResponseToSubsections(data.output, null);
        const score = this.createSectionWiseData(
          data.output,
          subsections,
          null
        );

        modal.id = data.id;
        modal.score = score.overallSection.score;
        (modal.timeAgo = timeAgo.ago(
          new Date(data.hookedTime ? data.hookedTime : data.completed_at)
        )),
          (modal.url = this.createValidUrl(data.input.url));
        modal.url = modal.url.replace(/^(?:https?:\/\/)?/i, "").split("/")[0];
        modal.color1 = this.getRecentReportColor(modal);

        reportArray.splice(reportArray.length, 0, modal);
      }
    }
    return reportArray;
  };

  private getRecentReportColor = (modal) => {
    if (modal.score < 50) {
      return "alert alert-danger";
    } else if (modal.score >= 50 && modal.score < 80) {
      return "alert alert-warning";
    } else {
      return "alert alert-primary";
    }
  };

  saveReport = async (data: Data) => {
    const database = firebaseAdmin.database();
    const reference = database.ref(`reports/${data.id}`);

    data.output.screenshot = await this.imageService.storeImage(
      data.output.screenshot,
      data.id
    );

    data.output.deviceRendering.data.mobile = await this.imageService.storeImage(
      data.output.deviceRendering.data.mobile,
      data.id
    );

    data.output.deviceRendering.data.tablet = await this.imageService.storeImage(
      data.output.deviceRendering.data.tablet,
      data.id
    );

    data.hookedTime = new Date().toString();

    await reference.set(JSON.parse(JSON.stringify(data)));
  };

  private isValidWebsiteUrl(url: string): boolean {
    url = url.replace(/\/$/, "");

    const websiteRegex = /^[a-zA-Z\d]+\.[a-zA-Z\d]+$|^http:\/\/www\.[a-zA-Z\d]+\.[a-zA-Z\d]+$|^https:\/\/www\.[a-zA-Z\d]+\.[a-zA-Z\d]+$|^www\.[a-zA-Z\d]+\.[a-zA-Z\d]+$/;

    return websiteRegex.test(url);
  }

  private createValidUrl(url: string): string {
    if (url.indexOf("https://") >= 0 || url.indexOf("http://") >= 0) {
      return url;
    } else if (url.indexOf("www.") >= 0) {
      return `https://${url}`;
    }
    return `https://www.${url}`;
  }

  getApiReport = async (reportId: number): Promise<string> => {
    try {
      const apiResponse = await axios.get(seo_API_URL + "get/" + reportId, {
        headers: {
          "x-api-key": seo_API_KEY,
          "Content-Type": "application/json",
        },
      });

      return apiResponse.data.success ? "ok" : "wait";
    } catch (e) {
      console.log(e);

      return e.toString();
    }
  };
}

export interface ReportApiResponse {
  data: any;
  errors: string[];
}
