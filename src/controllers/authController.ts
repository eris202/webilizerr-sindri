import passport from "passport"
import { Service, Inject } from "typedi"
import { AuthService, RegistrationResult } from "../services/auth-service"

@Service()
export class AuthController {
  @Inject() private authService: AuthService

  postRegister = async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const userInfo = { name, email, password, password2 };
    const result: RegistrationResult = await this.authService.registerUser(
      userInfo
    )

    if (result.errors.length > 0) {
      res.render("register", {
        error: result.errors,
        ...userInfo,
      })
    } else {
      req.flash('message', 'You have been sent an email for account confirmation')
      res.redirect("/")
    }
  };

  viewRegisterPage = (req, res) => {
    res.render("register")
  };

  verifyUserLink = async (req, res) => {
    const token = req.query.token
    if (!token) {
      return res.status(401).send('No token supplied')
    }

    try {
      await this.authService.verifyUserLink(token)
      req.flash('message', 'Your email is now registered. You can login with your credentials')

      return res.redirect('/')
    } catch (e) {
      console.log(e)
      return res.status(401).send('Token has expired or is invalid')
    }
  }

  postLogin = (req, res, next) => {
    // passport authenticate
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        req.flash('message', 'Invalid user name or password')
        return res.redirect('/login')
      }

      req.login(user, info => {
        if (info) {
          console.log(info)
          next(info)
        }

        req.flash('message', 'You are logged in')
        return res.redirect('/')
      })
    })(req, res, next);
  };

  viewLoginPage = (req, res) => {
    const message = req.flash('message')
    console.log(`flash message ${message}`)
    res.render("login", {
      message: message
    });
  };

  postForgotPassword = (req, res) => {
    res.render("login");
  };

  viewForgotPasswordPage = (req, res) => {
    console.log("starting forgot password controller");
    res.render("forgotpassword");
  };
}

