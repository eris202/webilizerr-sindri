import Report from "../model/Report"

import { Service, Inject } from 'typedi'
import { ReportService } from '../services/report-service'
import { ReportCreateResponse } from "../model/ReportCreateResponse";
import { Data } from "../model/TypedReport";

@Service()
export class ReportController {

  @Inject() private reportService: ReportService

  renderReportPage = async (req, res) => {
    const reportId = req.params.reportId;

    try {
      const data = await this.reportService.renderReportPage(reportId, req.user)
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
    const websiteUrl = req.body.url

    const response = await this.reportService.postApi(websiteUrl, req.user)

    if ((response as ReportCreateResponse).data) {
      const creationResponse = response as ReportCreateResponse

      if (creationResponse.success) {
        return res.redirect(`loader?reportId=${creationResponse.data.id}`)
      }

      req.flash('message', 'There was an error connecting to our services. Please try again later')
      return res.redirect('/')
    }

    req.flash('message', (response as {error: string}).error)

    return res.redirect('/')
  }

  viewMyReports = async (req, res) => {
    const pageNum = +(req.query.page? req.query.page : 1)
    const model = await this.reportService.getMyScannedReport(pageNum, req.user)

    return res.render('recently-scanned', model)
  }

  reportHook = async (req, res) => {
    const reportData = {
      id: req.body.id,
      input: JSON.parse(req.body.input),
      output: JSON.parse(req.body.output),
      created_at: req.body.created_at,
      completed_at: req.body.completed_at
    } as Data

    console.log('hook called')
    this.reportService.saveReport(reportData)
    
    console.log('hook process finished')
    res.status(200).end() 
  }

  viewRecentlyScanned = async (req, res) => {
    const pageNum = +(req.query.page? req.query.page : 1)
    const model = await this.reportService.getRecentlyScannedReport(pageNum)

    return res.render('recently-scanned', model)
  }

  viewAboutPage = (req, res) => {
    res.render("about", {
      reportId: null,
    })
  }

}
