import Report from "../model/Report"

import { Service, Inject } from 'typedi'
import { ReportService } from '../services/report-service'

@Service()
export class ReportController {

  @Inject() private reportService: ReportService

  renderReportPage = async (req, res) => {
    const reportId = req.params.reportId;

    try {
      const data = await this.reportService.renderReportPage(reportId)
      res.render('report', data)
    } catch (e) {
      console.log(e)
      res.render('report', {
        error: e
      })
    }
  }

  viewHomePage = async (req, res) => {
    const sessionId = req.sessionID
    try {
      const report = await Report.find({ sessionId })

      console.log(`worked ${report.sessionID}`)
    } catch (e) {
      console.log(e)
    }

    res.render('index', {
      message: req.flash('message')
    })
  }

  postReport = async (req, res) => {
    const websiteUrl = req.body.websiteUrl;

    // This is the service with all validations and returns 
    // api response
    const apiData = this.reportService.postApi(websiteUrl)

    res.json(apiData)
  }

  viewAboutPage = (req, res) => {
    res.render("about", {
      reportId: null,
    })
  }

}
