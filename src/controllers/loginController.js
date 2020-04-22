const passport = require("passport");

exports.postLogin = (req, res, next) => {
  console.log("POST-Login... ");

  // passport authenticate
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/about-us",

    // if (err) {
    //   console.log("passport.authenticate login error");

    //   return next(err);
    // }
    // if (!user) {
    //   console.log("passport.authenticate login no user");

    //   return res.redirect("/login");
    // }
    // req.logIn(user, function (err) {
    //   console.log("passport.authenticate login success " + user);

    //   if (err) {
    //     return next(err);
    //   }
    //   return res.redirect("/");
    // });
  })(req, res, next);
};

// Render login page
exports.renderLoginPage = (req, res) => {
  res.render("login");
  console.log("starting login controller");
};
