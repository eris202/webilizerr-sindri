import { ReportController } from "../controllers/reportController";
import { AuthController } from "../controllers/authController";
import { Container } from "typedi";
import { InvoiceController } from "../controllers/invoiceController";
import { ContactUsController } from "../controllers/contactUsController";
import { ProductPlan } from "../factories/product-plan-factory";
import User from "../model/User";

const reportController = Container.get(ReportController);
const authController = Container.get(AuthController);
const invoiceController = Container.get(InvoiceController);
const contactUsController = Container.get(ContactUsController);

const alreadyLoggedInMiddleWare = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  req.flash("message", "You cannot access the page while logged out.");
  return res.redirect("/");
};

const shouldBeLoggedInMiddleWare = (req, res, next) => {
  const backUrl = `${req.protocol}://${req.get("Host")}${req.originalUrl}`;

  if (
    backUrl.includes("http://localhost:5555/checkout?") &&
    req.isAuthenticated()
  ) {
    console.log("1");

    // console.log("is authenticated in shouldBeLoggedInMiddleWare");
    return next();
  }

  if (
    backUrl.includes("http://localhost:5555/letslogin?") &&
    req.isAuthenticated()
  ) {
    console.log("2");

    if (typeof req.user !== "undefined") {
      console.log("44");

      const dbUser = User.findOne({
        email: req.user.email,
        isActive: true,
      });

      dbUser.numOfScans = Math.max(0, dbUser.numOfScans - 1);
      console.log("decreasing number of scanns: " + dbUser.numOfScans);

      dbUser.save();
    }
    return false;
    const string = backUrl.replace("/letslogin?", "");
    // console.log("Its A MATCH");
    return res.redirect(string);

    //return res.redirect(`${backUrl}`);
  } else {
    if (req.isAuthenticated()) {
      console.log("0");
      return next();
    }
    console.log("3");

    // console.log("NOOOOO");
    return res.redirect(`/login?backUrl=${backUrl}`);
    //return next();
  }
};

const serviceMiddleWare = (req, res, next) => {
  const backUrl = `${req.protocol}://${req.get("Host")}${req.originalUrl}`;
  console.log("serviceMiddleWare...");
  if (req.isAuthenticated()) {
    console.log("backUrl: " + backUrl);

    if (backUrl.includes("http://localhost:5555/report/")) {
      var parts = backUrl.split("/");
      var lastSegment = parts.pop() || parts.pop(); // handle potential trailing slash

      console.log("lastSegment: " + lastSegment);

      return res.redirect(backUrl);

      //return res.redirect(`${backUrl}`);
    } else {
      return next();

      //return res.redirect(`/login?backUrl=${backUrl}`);
    }
  }
};

const shouldHaveOneTimePayment = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    const backUrl = `${req.protocol}://${req.get("Host")}${req.originalUrl}`;
    return res.redirect(`/login?backUrl=${backUrl}`);
  }

  const dbUser = await User.findOne({
    email: req.user.email,
    isActive: true,
  });

  if (!dbUser) {
    const backUrl = `${req.protocol}://${req.get("Host")}${req.originalUrl}`;
    return res.redirect(`/login?backUrl=${backUrl}`);
  }

  const plan = ProductPlan.getProductConfig(dbUser.productPlan);

  if (plan.isOneTime) {
    return next();
  }

  const backUrl = `${req.protocol}://${req.get("Host")}${req.originalUrl}`;
  return res.redirect(`/login?backUrl=${backUrl}`);
};

export interface RouteMapper {
  [key: string]: RouteDefinition[];
}

export class RouteDefinition {
  method: "post" | "get" | "put" | "delete";
  handler: (req, res, next?) => void;
  middleWares?: Array<(req, res, next) => void> = [];
}

/*
    This is kind of like a small routing framework. All you have to do is make 
    a route name. Then inside the route name you may have different handlers which
    will be HTTP method specific to different controller methods. Then the routes
    will automatically be configured with the express router.
*/
export const routes: RouteMapper[] = [
  {
    "/report/:reportId": [
      {
        method: "get",
        handler: reportController.renderReportPage,
      },
      {
        method: "post",
        handler: authController.postLogin,
      },
    ],
  },
  {
    "/logout": [
      {
        method: "get",
        handler: authController.logout,
      },
    ],
  },
  {
    "/on-page-seo": [
      {
        method: "get",
        handler: reportController.renderOnPageSeo,
      },
    ],
  },
  {
    "/letsregister": [
      {
        method: "get",
        handler: authController.viewRegisterPage,
        //middleWares: [shouldBeSignUpInMiddleWare],
      },
      {
        method: "post",
        handler: authController.postRegister,
        //middleWares: [shouldBeSignUpInMiddleWare],
      },
    ],
  },
  {
    "/register": [
      {
        method: "get",
        handler: authController.viewRegisterPage,
        middleWares: [alreadyLoggedInMiddleWare],
      },
      {
        method: "post",
        handler: authController.postRegister,
        middleWares: [alreadyLoggedInMiddleWare],
      },
    ],
  },
  {
    "/letslogin": [
      {
        method: "get",
        middleWares: [shouldBeLoggedInMiddleWare],
        handler: reportController.renderLoginPage,
      },
      {
        method: "post",
        middleWares: [shouldBeLoggedInMiddleWare],
        handler: reportController.renderLoginPage,
      },
    ],
  },

  {
    "/login": [
      {
        method: "get",
        handler: authController.viewLoginPage,
        middleWares: [alreadyLoggedInMiddleWare],
      },
      {
        method: "post",
        handler: authController.postLogin,
        middleWares: [alreadyLoggedInMiddleWare],
      },
    ],
  },
  {
    "/report": [
      {
        method: "get",
        handler: (req, res) => res.render("report"),
      },
      {
        method: "post",
        handler: authController.postLogin,
      },
    ],
  },
  {
    "/": [
      {
        method: "post",
        handler: reportController.postReport,
      },
      {
        method: "get",
        handler: reportController.viewHomePage,
      },
    ],
  },
  {
    "/hook": [
      {
        method: "post",
        handler: reportController.reportHook,
      },
    ],
  },
  {
    "/my-reports": [
      {
        method: "get",
        handler: reportController.viewMyReports,
        middleWares: [shouldBeLoggedInMiddleWare],
      },
    ],
  },
  {
    "/forgot-password": [
      {
        method: "get",
        handler: authController.viewForgotPasswordPage,
      },
      {
        method: "post",
        handler: authController.postForgotPassword,
      },
    ],
  },
  {
    "/reset-password": [
      {
        method: "get",
        handler: authController.viewResetPassword,
      },
      {
        method: "post",
        handler: authController.postResetPassword,
      },
    ],
  },
  {
    "/auth/verify": [
      {
        method: "get",
        handler: authController.verifyUserLink,
      },
    ],
  },

  {
    "/pricing": [
      {
        method: "get",
        handler: invoiceController.viewPricingPage,
      },
    ],
  },
  {
    "/checkout": [
      {
        method: "get",
        handler: invoiceController.viewCheckoutPage,
        middleWares: [shouldBeLoggedInMiddleWare],
      },
      {
        method: "post",
        handler: invoiceController.postCheckout,
        middleWares: [shouldBeLoggedInMiddleWare],
      },
    ],
  },

  {
    "/forgotpassword": [
      {
        method: "get",
        handler: authController.viewForgotPasswordPage,
        middleWares: [alreadyLoggedInMiddleWare],
      },
      {
        method: "post",
        handler: authController.postForgotPassword,
        middleWares: [alreadyLoggedInMiddleWare],
      },
    ],
  },

  {
    "/features": [
      {
        method: "get",
        handler: (req, res) => res.render("features"),
      },
    ],
  },
  {
    "/about-us": [
      {
        method: "get",
        handler: (req, res) => res.render("about-us"),
      },
    ],
  },
  {
    "/appointment": [
      {
        method: "get",
        middleWares: [shouldBeLoggedInMiddleWare, shouldHaveOneTimePayment],
        handler: (req, res) => res.render("appointment"),
      },
      {
        method: "post",
        middleWares: [shouldBeLoggedInMiddleWare, shouldHaveOneTimePayment],
        handler: invoiceController.postAppointment,
      },
    ],
  },
  {
    "/get-in-touch": [
      {
        method: "get",
        handler: contactUsController.viewContactUsForm,
      },
      {
        method: "post",
        handler: contactUsController.postContactUsForm,
      },
    ],
  },
  {
    "/terms": [
      {
        method: "get",
        handler: (req, res) => res.render("terms"),
      },
    ],
  },
  {
    "/privacy-policy": [
      {
        method: "get",
        handler: (req, res) => res.render("privacy-policy"),
      },
    ],
  },
  {
    "/thank-you": [
      {
        method: "get",
        handler: (req, res) => res.render("thank-you"),
      },
    ],
  },
  {
    "/recently-scanned": [
      {
        method: "get",
        handler: reportController.viewRecentlyScanned,
      },
    ],
  },
  {
    "/loader": [
      {
        method: "get",
        handler: (req, res) => res.render("pre-loader"),
      },
    ],
  },

  {
    "/pricing-scans": [
      {
        method: "get",
        handler: (req, res) => res.render("pricing-scans"),
      },
    ],
  },
  {
    "/on-page-seo": [
      {
        method: "get",
        handler: reportController.renderOnPageSeo,
      },
    ],
  },
];
