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
      res.render("register", {
        error: result.errors,
        ...userInfo,
      });
    } else {
      req.flash(
        "message",
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
        "message",
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

    req.flash("message", "You have been logged out.");
    res.redirect("/");
  };

  postLogin = (req, res, next) => {
    // passport authenticate
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        req.flash("message", "Invalid user name or password");
        return res.redirect("/login");
      }

      req.login(user, (info) => {
        if (info) {
          next(info);
        }

        const redirectUrl = req.query.backUrl || "/";

        req.flash("message", "You are logged in");
        return res.redirect(redirectUrl);
      });
    })(req, res, next);
  };

  viewLoginPage = (req, res) => {
    const message = req.flash("message");
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
        "message",
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
      req.flash("message", result.error);
    } else {
      req.flash("message", result.data);
    }

    return res.redirect("/");
  };
}
