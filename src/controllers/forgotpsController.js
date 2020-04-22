const axios = require("axios");
const User = require("../model/User");
const bcrypt = require('bcrypt');




exports.postForgotPassword = (req, res) => {
    console.log("starting forgotten password");
  
  }
  exports.renderForgotpasswordPage = (req, res) => {
    res.render("forgotpassword");
    console.log("starting forgot password controller");
  };
  
  
  
