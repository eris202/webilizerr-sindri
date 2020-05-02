const axios = require("axios");
const Report = require("../model/Report");
const seo_API_URL = require(".././config/keys").seoptimerAPI;
const seo_API_KEY = require(".././config/keys").seoptimerKEY;

// exports.renderReportPage = (req, res) => {

//   res.render("report");
//   console.log("starting report controller");
// };

exports.getCallback = (req, res) => {
  console.log("params", req.params);
  console.log("body", req.body);
  console.log("query", req.query);
};

exports.renderReportPage = (req, res) => {
  console.log(req.params.reportId);
  let reportId = req.params.reportId;

  // If report id is null just render empty report page and stop
  if (!reportId) {
    res.render('report')

    return
  }

  var perC = 0;
  var perW = 0;
  var seoC = 0;
  var seoW = 0;
  var socialC = 0;
  var socialW = 0;
  var uiC = 0;
  var uiW = 0;
  var secC = 0;
  var secW = 0;

  // res.render("report");
  console.log("starting report controller");
  //console.log("GET " + seo_API_URL + "get/" + reportId);

  if (reportId) {
    axios
      .get(seo_API_URL + "get/" + reportId, {
        headers: {
          "x-api-key": seo_API_KEY,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          let reportModel = new Report(response.data);

          //console.log(reportModel.data)
          jsonn = reportModel.data.output;
          console.log(response.data.data.output.deviceRendering);

          for (let key of Object.entries(jsonn)) {
            //let object = jsonn[key];
            const temp = key[1];

            if (key[1]) {
              if (temp.passed === true) {
                temp.color = "panel-success";
                temp.warning = "Good";
              } else if (temp.passed === false) {
                temp.color = "panel-danger";
                temp.warning = "Warning";
              } else {
                temp.color = "panel-warning";
                temp.warning = "Info";
              }

              if (temp.section === "performance") {
                if (temp.passed === true) {
                  perC += 1;
                } else if (temp.passed === false) {
                  perW += 1;
                }
              } else if (temp.section === "seo") {
                if (temp.passed === true) {
                  seoC += 1;
                } else if (temp.passed === false) {
                  seoW += 1;
                }
              } else if (temp.section == "social") {
                if (temp.passed == true) {
                  socialC += 1;
                } else if (temp.passed == false) {
                  socialW += 1;
                }
              } else if (temp.section === "ui") {
                if (temp.passed === true) {
                  uiC += 1;
                } else if (temp.passed === false) {
                  uiW += 1;
                }
              } else if (temp.section === "security") {
                if (temp.passed === true) {
                  secC += 1;
                } else if (temp.passed === false) {
                  secW += 1;
                }
              }
            } else if (
              key[0] == "youtubeActivity" ||
              key[0] == "instagramActivity"
            ) {
              if (key[1] === true) {
                console.log("Social Coorect: " + key[0]);
                socialC += 1;
              } else if (key[1] === false) {
                console.log("Social Wrong: " + key[0]);
                socialW += 1;
              }
            }

            if (key[0] === "keywords") {
              if (temp == "passed") {
                console.log("PASSED");
              }

              const tem = key[1].data.keywords;

              for (let check of Object.values(tem)) {
                switch (check.description) {
                  case true:
                    check.descriptionColor = "green";
                    check.descriptionCheck = "mdi-check";
                    break;
                  case false:
                    check.descriptionColor = "red";
                    check.descriptionCheck = "mdi-close";

                    break;
                }

                switch (check.title) {
                  case true:
                    check.titleColor = "green";
                    check.titleCheck = "mdi-check";
                    break;
                  case false:
                    check.titleColor = "red";
                    check.titleCheck = "mdi-close";
                    break;
                }

                switch (check.headers) {
                  case true:
                    check.headersColor = "green";
                    check.headersCheck = "mdi-check";
                    break;
                  case false:
                    check.headersColor = "red";
                    check.headersCheck = "mdi-close";
                    continue;
                }
              }
            }
          }

          var performanceGrade = Math.round(100 * (perC / (perC + perW)));
          var seoGrade = Math.round(100 * (seoC / (seoC + seoW)));
          var uiGrade = Math.round(100 * (uiC / (uiC + uiW)));
          var securityGrade = Math.round(100 * (secC / (secC + secW)));
          var socialGrade = Math.round(100 * (socialC / (socialC + socialW)));

          var overallGrade = Math.round(
            (performanceGrade +
              seoGrade +
              uiGrade +
              securityGrade +
              socialGrade) /
              5
          );

          var red = "#DC143C";
          var yellow = "#FF8C00";
          var green = "#58a193";

          if (performanceGrade < 50) {
            jsonn.scores.performance.colorGrade = red; // Red
          } else if (performanceGrade >= 50 && performanceGrade < 80) {
            jsonn.scores.performance.colorGrade = yellow; // Yellow
          } else {
            jsonn.scores.performance.colorGrade = green; // Green
          }

          if (seoGrade < 50) {
            jsonn.scores.seo.colorGrade = red; // Red
          } else if (seoGrade >= 50 && seoGrade < 80) {
            jsonn.scores.seo.colorGrade = yellow; // Yellow
          } else {
            jsonn.scores.seo.colorGrade = green; // Green
          }

          if (uiGrade < 50) {
            jsonn.scores.ui.colorGrade = red; // Red
          } else if (uiGrade >= 50 && uiGrade < 80) {
            jsonn.scores.ui.colorGrade = yellow; // Yellow
          } else {
            jsonn.scores.ui.colorGrade = green; // Green
          }

          if (securityGrade < 50) {
            jsonn.scores.security.colorGrade = red; // Red
          } else if (securityGrade >= 50 && securityGrade < 80) {
            jsonn.scores.security.colorGrade = yellow; // Yellow
          } else {
            jsonn.scores.security.colorGrade = green; // Green
          }

          if (socialGrade < 50) {
            jsonn.scores.social.colorGrade = red; // Red
          } else if (socialGrade >= 50 && socialGrade < 80) {
            jsonn.scores.social.colorGrade = yellow; // Yellow
          } else {
            jsonn.scores.social.colorGrade = green; // Green
          }

          if (overallGrade < 50) {
            jsonn.scores.overall.colorGrade = red; // Red
          } else if (overallGrade >= 50 && overallGrade < 80) {
            jsonn.scores.overall.colorGrade = yellow; // Yellow
          } else {
            jsonn.scores.overall.colorGrade = green; // Green
          }

          jsonn.scores.performance.newGrade = performanceGrade;
          jsonn.scores.seo.newGrade = seoGrade;
          jsonn.scores.ui.newGrade = uiGrade;
          jsonn.scores.security.newGrade = securityGrade;
          jsonn.scores.social.newGrade = socialGrade;
          jsonn.scores.overall.newGrade = overallGrade;

          //console.log("Headers: " + jsonn.headers)

          if (jsonn.headers.data.h1) {
            jsonn.headers.h1count = jsonn.headers.data.h1.length;
          }
          if (jsonn.headers.data.h2) {
            jsonn.headers.h2count = jsonn.headers.data.h2.length;
          }

          if (jsonn.headers.data.h3) {
            jsonn.headers.h3count = jsonn.headers.data.h3.length;
          }

          if (jsonn.headers.data.h4) {
            jsonn.headers.h4count = jsonn.headers.data.h4.length;
          }

          if (jsonn.headers.data.h5) {
            jsonn.headers.h5count = jsonn.headers.data.h5.length;
          }
          if (jsonn.headers.data.h6) {
            jsonn.headers.h6count = jsonn.headers.data.h6.length;
          }

          if (jsonn.malware.data.google == "safe") {
            jsonn.malware.googleVerified = "mdi-check";
            jsonn.malware.googleColor = "success";
          } else if (jsonn.malware.data.google == "unverified") {
            jsonn.malware.googleVerified = "mdi-close";
            jsonn.malware.googleColor = "danger";
          }

          if (jsonn.malware.data.mcafee == "safe") {
            jsonn.malware.mcafeeVerified = "mdi-check";
            jsonn.malware.mcafeeColor = "success";
          } else if (jsonn.malware.data.mcafee == "unverified") {
            jsonn.malware.mcafeeVerified = "mdi-close";
            jsonn.malware.mcafeeColor = "danger";
          }

          if (jsonn.malware.data.norton == "safe") {
            jsonn.malware.nortonVerified = "mdi-check";
            jsonn.malware.nortonColor = "success";
          } else if (jsonn.malware.data.norton == "unverified") {
            jsonn.malware.nortonVerified = "mdi-close";
            jsonn.malware.nortonColor = "danger";
          }

          if (jsonn.malware.data.avg == "safe") {
            jsonn.malware.avgVerified = "mdi-check";
            jsonn.malware.avgColor = "success";
          } else if (jsonn.malware.data.avg == "unverified") {
            jsonn.malware.avgVerified = "mdi-close";
            jsonn.malware.avgColor = "danger";
          }

          if (
            jsonn.malware.data.avg == "unverified" ||
            jsonn.malware.data.norton == "unverified" ||
            jsonn.malware.data.mcafee == "unverified" ||
            jsonn.malware.data.google == "unverified"
          ) {
            jsonn.malware.color = "panel-danger";
            jsonn.malware.warning = "Warning";
            jsonn.malware.shortAnswer =
              "Your website has NOT been flagged as safe by popular malware scanners.";
          } else {
            jsonn.malware.color = "panel-success";
            jsonn.malware.warning = "Good";
            jsonn.malware.shortAnswer =
              "Your website has been flagged as safe by popular malware scanners";
          }

          const responseTime = jsonn.serverResponseTime.data.responseTime;
          const loadTime = jsonn.serverResponseTime.data.loadTime;
          const completeTime = jsonn.serverResponseTime.data.completeTime;
          var responseTimeColor = "";
          var loadTimeColor = "";
          var completeTimeColor = "";
          var loadTimeLeft;
          var responseTimeLeft;
          var completeTimeLeft;
          var green = "#16fa62";
          var yellow = "#fae316";
          var red = "#ff5f68";

          if (responseTime <= 10) {
            responseTimeColor = green;
            jsonn.serverResponseTime.data.responsegood = "Very good";
          } else if (responseTime > 10 && responseTime < 20) {
            responseTimeColor = yellow;
            jsonn.serverResponseTime.data.responsegood =
              "You need to do better";
          } else if (responseTime >= 20) {
            responseTimeColor = red;
            jsonn.serverResponseTime.data.responsegood = "Very slow, must fix!";
          }

          if (loadTime <= 10) {
            loadTimeColor = green;
            jsonn.serverResponseTime.data.loadgood = "Very good";
          } else if (loadTime > 10 && loadTime < 20) {
            loadTimeColor = yellow;
            jsonn.serverResponseTime.data.loadgood = "You need to do better";
          } else if (loadTime > 10) {
            loadTimeColor = red;
            jsonn.serverResponseTime.data.loadgood = "Very slow, must fix!";
          }

          if (completeTime <= 10) {
            completeTimeColor = green;
            jsonn.serverResponseTime.data.completegood = "Very good";
          } else if (completeTime > 10 && completeTime < 20) {
            completeTimeColor = yellow;
            jsonn.serverResponseTime.data.completegood =
              "You need to do better";
          } else if (completeTime > 10) {
            completeTimeColor = red;
            jsonn.serverResponseTime.data.completegood = "Very slow, must fix!";
          }

          if (responseTime < 60) {
            responseTimeLeft = 60 - responseTime;
          } else {
            responseTimeLeft = Math.round(responseTime * 0.3);
          }

          if (loadTime < 60) {
            loadTimeLeft = 60 - loadTime;
          } else {
            loadTimeLeft = Math.round(loadTime * 0.1);
          }

          if (completeTime < 60) {
            completeTimeLeft = 60 - completeTime;
          } else {
            completeTimeLeft = Math.round(completeTime * 0.2);
          }
          jsonn.serverResponseTime.data.responseTime = responseTime;
          jsonn.serverResponseTime.data.loadTime = loadTime;
          jsonn.serverResponseTime.data.completeTime = completeTime;
          jsonn.serverResponseTime.data.responseTimeColor = responseTimeColor;
          jsonn.serverResponseTime.data.loadTimeColor = loadTimeColor;
          jsonn.serverResponseTime.data.completeTimeColor = completeTimeColor;
          jsonn.serverResponseTime.data.responseTimeLeft = responseTimeLeft;
          jsonn.serverResponseTime.data.loadTimeLeft = loadTimeLeft;
          jsonn.serverResponseTime.data.completeTimeLeft = completeTimeLeft;

          // Change byte to mb
          jsonn.pageSize.data.mbSize = formatBytes(
            jsonn.pageSize.data.totalSize
          );

          function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return "0 Bytes";

            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
          }

          var string = jsonn.dns.data;
          string = string.replace(/[<BR>]/g, " ");
          string = string.replace(/[br]/g, " ");
          jsonn.dns.data = string;

          reportModel.data.output = jsonn;

          console.log(jsonn.charset);

          var string = jsonn.dns.data;
          string = string.replace(/[<BR>]/g, " ");
          string = string.replace(/[br]/g, " ");
          jsonn.dns.data = string;

          reportModel.data.output = jsonn;

          res.render("report", {
            success: reportModel.success,
            status: reportModel.success,
            data: reportModel.data,
          });
        } else {
          console.log(response.data);

          res.render("report", {
            status: response.data.success,
            reportId: reportId,
            data: false,
          });
        }
      })
      .catch((error) => {
        console.log("4 GET report error");
        console.log(error);
        res.render("report", {
          error: error,
        });
      });
  } else {
    res.render("report");
  }
};
