import Report from "../model/Report";

import { Service, Inject } from "typedi";
import { ReportService } from "../services/report-service";
import { ReportCreateResponse } from "../model/ReportCreateResponse";
import { Data } from "../model/TypedReport";
import firebaseAdmin from "../config/firebase-setup";
import User from "../model/User";

@Service()
export class ReportController {
  @Inject() private reportService: ReportService;

  renderReportPage = async (req, res) => {
    const reportId = req.params.reportId;
    console.log("renderReportPage " + reportId);

    try {
      const data = await this.reportService.renderReportPage(
        reportId,
        req.user
      );
      const flashMessage = req.flash();
      res.render("report", {
        data: data,
        message: flashMessage,
      });
    } catch (e) {
      console.log(e);
      res.render("report", {
        error: e,
      });
    }
  };

  renderLoginPage = (req, res) => {
    const message = req.flash();
    res.render("login", {
      message: message,
    });
  };
  renderOnPageSeo = async (req, res) => {
    try {
      if (req.user) {
        const data = await this.reportService.renderServicePage(req.user);
        const tempData = Object.assign({}, Object.values(data.reportData));
        const flashMessage = req.flash();

        res.render("on-page-seo", {
          data: tempData,
          message: flashMessage,
        });
      } else {
        res.render("on-page-seo");
      }
    } catch (e) {
      console.log(e);
      res.render("on-page-seo", {
        error: e,
      });
    }
  };

  renderBlurrPage = (req, res) => {
    const message = req.flash();
    res.render("reportold", {
      message: message,
    });
  };

  // todo 'Homepage' "Over 10k scanns" At the moment we are fetching the whole database and then count
  // and it looks like firebase doesnt offer count feature on their side so we need
  // to fetch everything and then count. With that we are paying extra "read" from
  // them. Solution would be to have our own db servers.
  viewHomePage = async (req, res) => {
    const database = firebaseAdmin.database();
    const reference = database.ref(`reports`);
    const totalScans = await reference.once("value").then(function (snapshot) {
      var a = snapshot.numChildren();
      return a;
    });

    // const sessionId = req.sessionID;
    // try {
    //   const report = await Report.find({ sessionId });

    //   console.log("worked: " + report);
    // } catch (e) {
    //   console.log(e);
    // }

    const flashMessage = req.flash();

    res.render("index", {
      message: flashMessage,
      totalScans: totalScans,
    });
  };

  decreasingNumOfScans = async (req, res) => {
    if (typeof req.user !== "undefined") {
      const dbUser = await User.findOne({
        email: req.user.email,
        isActive: true,
      });
      dbUser.scanCounter = dbUser.scanCounter++;
      console.log("dbUser.scanCounter: " + dbUser.scanCounter);
      dbUser.numOfScans = Math.max(0, dbUser.numOfScans - 1);
      console.log("decreasing number of scanns: " + dbUser.numOfScans);

      return await dbUser.save();
    }
    return false;
  };

  postReport = async (req, res) => {
    const websiteUrl = req.body.url;

    const response = await this.reportService.postApi(websiteUrl, req.user);
    if ((response as ReportCreateResponse).data) {
      const creationResponse = response as ReportCreateResponse;

      if (creationResponse.success) {
        await this.decreasingNumOfScans(req, res);
        return res.redirect(`loader?reportId=${creationResponse.data.id}`);
      } else {
        req.flash(
          "error",
          "There was an error connecting to our services. Please try again later"
        );
      }
      return res.redirect("/");
    }

    req.flash("error", (response as { error: string }).error);
    return res.redirect("/");
  };

  viewMyReports = async (req, res) => {
    const pageNum = +(req.query.page ? req.query.page : 1);
    const model = await this.reportService.getMyScannedReport(
      pageNum,
      req.user
    );
    if (!(Object.keys(model).length === 0 && model.constructor === Object)) {
      return res.render("recently-scanned", model);
    } else {
      req.flash("warning", "You dont have any reports in database, yet!");
      return res.redirect("/");
    }
  };

  reportHook = async (req, res) => {
    const reportData = {
      id: req.body.id,
      input: JSON.parse(req.body.input),
      output: JSON.parse(req.body.output),
      created_at: req.body.created_at,
      completed_at: req.body.completed_at,
      generatedByUser: req.user,
    } as Data;

    this.reportService.saveReport(reportData);

    res.status(200).end();
  };

  viewRecentlyScanned = async (req, res) => {
    const pageNum = +(req.query.page ? req.query.page : 1);
    const data = await this.reportService.getRecentlyScannedReport(pageNum);
    return res.render("recently-scanned", data);
  };

  viewAboutPage = (req, res) => {
    res.render("about", {
      reportId: null,
    });
  };
}
