import Report from "../model/Report"

import { Service, Inject } from 'typedi'
import { ReportService } from '../services/report-service'
import { ReportCreateResponse } from "../model/ReportCreateResponse";

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

    const flashMessage = req.flash('message')
    console.log(`flash message ${flashMessage}`)
    res.render('index', {
      message: flashMessage
    })
  }

  postReport = async (req, res) => {
    const websiteUrl = req.body.url;

    const response = await this.reportService.postApi(websiteUrl)

    if ((response as ReportCreateResponse).data) {
      const creationResponse = response as ReportCreateResponse

      if (creationResponse.success) {
        return res.redirect(`loader?reportId=${creationResponse.data.id}`)
      }

      req.flash('message', 'There was an error connecting to our services. Please try again later')
      return res.redirect('/')
    }

    req.flash('message', 'Please post an url in the format https://www.my-awesomewebsite.com')
    return res.redirect('/')
  }

  viewAboutPage = (req, res) => {
    res.render("about", {
      reportId: null,
    })
  }

}
