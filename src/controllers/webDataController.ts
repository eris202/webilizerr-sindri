import Report from "../model/Report"
const seo_API_URL = require("../config/keys").seoptimerAPI;
const seo_API_KEY = require("../config/keys").seoptimerKEY;

import { Service, Inject } from 'typedi'
import { ReportService } from '../services/web-data-service'

@Service()
export class ReportPageController {

  @Inject() private reportService: ReportService

  // This is just viewing the home page
  viewHomePage = async (req, res) => {
    const sessionId = req.sessionID
    try {
      const report = await Report.find({ sessionId })

      console.log(`worked ${report.sessionID}`)
    } catch (e) {
      console.log(e)
    }

    res.render('index')
  }

  postReport = async (req, res) => {
    const websiteUrl = req.body.websiteUrl;

    // This is the service with all validations and returns 
    // api response
    const apiData = this.reportService.postApi(websiteUrl)

    res.json(apiData)
  }

  getReport = async (req, res) => {
    const reportId = req.body.report_id
    console.log("report id: ", reportId)

    const responseData = this.reportService.getApiReport(reportId)
    res.end(responseData)
  }

  viewAboutPage = (req, res) => {
    res.render("about", {
      reportId: null,
    })
  }

}
