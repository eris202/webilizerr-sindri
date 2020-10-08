import passport from "passport";
import { Service, Inject } from "typedi";
import { AuthService, RegistrationResult } from "../services/auth-service";
import { JsonWebTokenError } from "jsonwebtoken";

@Service()
export class AuthController {
  @Inject() private authService: AuthService;

  postRegister = async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const userInfo = { name, email, password, password2 };
    const backUrl = `${req.protocol}://${req.get("Host")}${req.originalUrl}`;

    const result: RegistrationResult = await this.authService.registerUser(
      userInfo,
      backUrl
    );

    if (result.errors.length > 0) {
      const text = result.errors.map(function (item) {
        return item["msg"];
      });
      req.flash("error", text);
      const flash = req.flash();

      res.render("register", {
        error: result.errors,
        ...userInfo,
        message: flash,
      });
    } else {
      req.flash(
        "warning",
        "You have been sent an email for account confirmation"
      );
      res.redirect("/");
    }
  };

  viewRegisterPage = async (req, res) => {
    res.render("register");
  };

  verifyUserLink = async (req, res) => {
    // const tokenString = new URLSearchParams(req.query).get("token");
    // const backUrl = new URLSearchParams(req.query).get("backurl");
    const urlParams = new URLSearchParams(req.query);
    const tokenString = urlParams.get("token");
    const backUrl = urlParams.get("backurl");

    // const backUrl = req.query.backurl;

    if (!tokenString) {
      return res.status(401).send("No token supplied");
    }

    try {
      await this.authService.verifyUserLink(tokenString);

      req.flash(
        "success",
        "Account has been registered successfully. Please log in now."
      );
      console.log("Registration complete: " + backUrl);
      if (backUrl.length > 2) {
        return res.redirect(backUrl);
      }

      return res.redirect("/");
    } catch (e) {
      console.log(e);
      return res.status(401).send("Token has expired or is invalid");
    }
  };

  logout = (req, res) => {
    req.logout();

    req.flash("success", "You have been logged out.");
    res.redirect("/");
  };

  postLogin = async (req, res, next) => {
    const urlParams = new URLSearchParams(req.query);
    const backUrl = urlParams.get("backurl");
    // passport authenticate

    if (req.body.pass2) {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.pass1;
      const password2 = req.body.pass2;
      const userInfo = { name, email, password, password2 };

      console.log("Starting to Register user in PostLogin " + userInfo.email);
      const backUrl = `${req.protocol}://${req.get("Host")}${req.originalUrl}`;
      const result: RegistrationResult = await this.authService.registerUser(
        userInfo,
        backUrl
      );
      console.log("1: ");

      if (result.errors.length > 0) {
        const text = result.errors.map(function (item) {
          return item["msg"];
        });

        req.flash("error", text);
        return res.redirect(backUrl);
      } else {
        req.flash(
          "warning",
          "You have been sent an email for account confirmation"
        );
        res.redirect("/");
      }
    } else {
      const backUrl = `${req.protocol}://${req.get("Host")}${req.originalUrl}`;

      passport.authenticate("local", async (err, user, info) => {
        if (err) {
          console.log("err in postLogin" + err);
          return next(err);
        }

        if (!user) {
          req.flash("error", "Invalid user name or password");
          return res.redirect(backUrl);
        }

        req.login(user, (info) => {
          if (info) {
            req.flash("success", "You have successfully logged in");
            next(info);
          }
          const redirectUrl = req.query.backUrl || "/";
          console.log("backUrl " + backUrl);

          if (backUrl.includes("report/")) {
            return res.redirect(backUrl);
          }

          return res.redirect(redirectUrl);
        });
      })(req, res, next);
    }
  };

  viewLoginPage = (req, res) => {
    const message = req.flash();
    res.render("login", {
      message: message,
    });
  };

  postForgotPassword = (req, res) => {
    const email = req.body.email;
    if (!email) {
      return res.redirect("/forgot-password");
    }

    try {
      this.authService.resetPassword(email);
    } catch (e) {
      console.log(e);
    } finally {
      req.flash(
        "warning",
        `An email with instructions has been sent to your email 
      address (please also check your spam folder)`
      );
      res.redirect("/");
    }
  };

  viewForgotPasswordPage = (req, res) => {
    res.render("forgot-password");
  };

  viewResetPassword = (req, res) => {
    res.render("reset-password");
  };

  postResetPassword = async (req, res) => {
    const token = req.query.token;
    const { password, repeatedPassword } = req.body;

    const result: any = await this.authService.updatePassword(
      token,
      password,
      repeatedPassword
    );

    if (result.error) {
      req.flash("error", result.error);
    } else {
      req.flash("success", result.data);
    }

    return res.redirect("/");
  };
}
