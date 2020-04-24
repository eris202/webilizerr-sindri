const axios = require("axios");
const dbService = require("../db.service");
const db = dbService.db;
const Weather = require("../model/Weather");
const Report = require("../model/Report");
const seo_API_URL = require(".././config/keys").seoptimerAPI;
const seo_API_KEY = require(".././config/keys").seoptimerKEY;

exports.renderHomePage = (req, res) => {
  const rreport = new Report();
  res.render("index");
  const sessionID = req.sessionID;
  //Report.sessionId = req.sessionID
  if (sessionID) {
    rreport.sessionID = req.sessionID;
    Report.find({ sessionID }, function (err, report) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log("Worked: " + rreport.sessionID);
      }
    });
  } else {
    console.log("Session ID failed: " + sessionID);
  }
  console.log(res);
};

exports.postReport = (req, res) => {
  // Get URL from View
  const websiteUrl = req.body.websiteUrl;

  console.log(websiteUrl);

  report = new Report(req.body);
  console.log("Report: " + report);

  console.log("Webiste URL: " + websiteUrl);

  if (this.report == "") {
    this.errors.push("Please enter a website URL.");
  }
  if (websiteUrl && websiteUrl.length == 0) {
    res.end("website url is required.");
  } else {
    console.log("2 GET in Controller: " + websiteUrl);

    console.log("2 About to start POST report: " + websiteUrl);
    axios
      .post(
        seo_API_URL + "create",
        { url: websiteUrl, pdf: 1 },
        {
          headers: {
            "x-api-key": seo_API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        console.log("3 POST successful");
        console.log(response.data);
        res.json(response.data);
      })
      .catch((error) => {
        console.log("4 Error");
        console.log(error);
      });
  }
};

exports.getReport = (req, res) => {
  let reportId = req.body.report_id;
  console.log("report Id: ", reportId);

  axios
    .get(seo_API_URL + "get/" + reportId, {
      headers: {
        "x-api-key": seo_API_KEY,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("3 GET report success");
      console.log(response.data);

      if (response.data.success) {
        res.end("okay");
      } else {
        res.end("wait");
      }
    })
    .catch((error) => {
      console.log("4 GET report error");
      console.log(error);
      res.render("index", { error: error });
      return response;
    });
};

exports.renderAboutPage = (req, res) => {
  res.render("about", {
    reportId: null,
  });
};
