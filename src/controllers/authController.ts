import passport from "passport"
import { Service, Inject } from "typedi";
import { AuthService, RegistrationResult } from '../services/auth-service'

@Service()
export class AuthController {

  @Inject() private authService: AuthService

  postRegister = async (req, res) => {
    console.log("Start postRegister: ");
    const { name, email, password, password2 } = req.body;
    const userInfo = { name, email, password, password2 }
    const result: RegistrationResult =
      await this.authService.registerUser(userInfo)

    if (result.errors.length > 0) {
      res.render('register', {
        error: result.errors,
        ...userInfo
      })
    } else {
      //TODO: new release to show redirect flash message
      res.redirect("/")
    }
  }

  viewRegisterPage = (req, res) => {
    console.log("starting register controller");
  }

  postLogin = (req, res, next) => {
    // passport authenticate
    passport.authenticate("local", {
      successRedirect: "/index",
      failureRedirect: "/about-us",
    })(req, res, next)
  }

  viewLoginPage = (req, res) => {
    console.log("starting login controller")
    res.render("login")
  }

  postForgotPassword = (req, res) => {
    console.log("starting forgotten password")
  }

  viewForgotPasswordPage = (req, res) => {
    console.log("starting forgot password controller")
    res.render("forgotpassword")
  }
}



// Register function
exports.postRegister = (req, res) => {

};

exports.renderRegisterPage = (req, res) => {
  res.render("register");
  console.log("starting register controller");
};




