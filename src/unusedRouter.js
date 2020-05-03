//TODO: This will be removed


const express = require("express");
const router = express.Router();
const controller = require("./controllers/reportController");
const reportController = require("./controllers/willBeRemovedReportController");
const loginController = require("./controllers/authController");
const registerController = require("./controllers/registerController");
const forgotpsController = require("./controllers/forgotpsController");
const { ensureAuthenticated } = require("./config/auth");

router.get("/", controller.renderHomePage);
router.post("/", controller.postReport);
router.post("/index/report", controller.getReport);

// router.get("/index", controller.renderAboutPage);
// router.post("/index", controller.postReport);
//

router.get("/report/:reportId", reportController.renderReportPage);
router.post("/report", reportController.getReport);
router.post("/check/report", controller.getReport);

router.get("/login", loginController.renderLoginPage);
router.post("/login", loginController.postLogin);

router.get("/forgotpassword", forgotpsController.renderForgotpasswordPage);
router.post("/forgotpassword", forgotpsController.postForgotPassword);

router.get("/register", registerController.renderRegisterPage);
router.post("/register", registerController.postRegister);

router.post("/callback", reportController.getCallback);

router.get("/features", function (req, res) {
  res.render("features");
});

router.get("/about-us", function (req, res) {
  res.render("about-us");
});

router.get("/appointment", function (req, res) {
  res.render("appointment");
});

router.get("/get-in-touch", function (req, res) {
  res.render("get-in-touch");
});

router.get("/privacy-policy", function (req, res) {
  res.render("privacy-policy");
});

router.get("/appointment", function (req, res) {
  res.render("appointment");
});

router.get("/thank-you", function (req, res) {
  res.render("thank-you");
});
router.get("/resetpassword", function (req, res) {
  res.render("resetpassword");
});
module.exports = router;
