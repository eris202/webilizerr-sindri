const axios = require("axios");
const User = require("../model/User");
const bcrypt = require("bcrypt");

exports.postRegister = (req, res) => {
  console.log("Start postRegister: ");
  const { name, email, password, password2 } = req.body;
  let error = [];
  console.log(req.body);
  // Check requiered fields
  if (!name || !email || !password || !password2) {
    error.push({ msg: "Please fill in all the fields!" });
  }

  if (password !== password2) {
    error.push({ msg: "Passwords do not match!" });
  }

  //Check password length
  if (password.length < 6) {
    error.push({ msg: "Pass must be at least 6 characters" });
  }

  if (error.length > 0) {
    console.log(error);
    res.render("register", {
      error,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          console.log("Email is already registered");
          error.push({ msg: "Email is already registered" });
          res.render("register", {
            error,
            name,
            email,
            password,
            password2,
          });
        } else {
          console.log("Registering new user...");
          const newUser = new User({
            name,
            email,
            password,
          });
          //Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              // Set password to hash
              newUser.password = hash;
              console.log("Hash: " + newUser.password);

              // Save user
              newUser
                .save()
                .then((user) => {
                  //req.flash('success_msg', 'You are now registered and can login')
                  res.redirect("/");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      })
      .catch((err) => console.log(err));
  }
};

exports.renderRegisterPage = (req, res) => {
  res.render("register");
  console.log("starting register controller");
};
