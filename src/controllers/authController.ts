import passport from "passport";
import { Service, Inject } from "typedi";
import { AuthService, RegistrationResult } from "../services/auth-service";

@Service()
export class AuthController {
  @Inject() private authService: AuthService;

  postRegister = async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const userInfo = { name, email, password, password2 };
    const result: RegistrationResult = await this.authService.registerUser(
      userInfo
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
    const token = req.query.token;
    if (!token) {
      return res.status(401).send("No token supplied");
    }

    try {
      await this.authService.verifyUserLink(token);
      req.flash(
        "success",
        "Account has been registered successfully. Please log in now."
      );

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

  postLogin = (req, res, next) => {
    // passport authenticate
    console.log("passport authenticate");
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        console.log("err in postLogin" + err);
        return next(err);
      }

      if (!user) {
        req.flash("error", "Invalid user name or password");
        return res.redirect("/login");
      }

      req.login(user, (info) => {
        if (info) {
          req.flash("success", "You are logged innnnnnn");
          next(info);
        }
        const redirectUrl = req.query.backUrl || "/";

        console.log("My-messages login", req.flash());
        return res.redirect(redirectUrl);
      });
    })(req, res, next);
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
