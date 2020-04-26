const path = require("path");
const express = require("express");
const app = express();
const router = require("./src/router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const port = process.env.PORT || 5555;
const flash = require("connect-flash");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
require("./src/config/passport")(passport);

app.use(express.static(path.join(__dirname, "./src/js")));
app.use(express.static(path.join(__dirname, "./src/public")));

var hbs = exphbs.create({
  layoutsDir: path.join(__dirname, "src/views/"),
  partialsDir: path.join(__dirname, "src/views/partials"),
  defaultLayout: false,
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(
  require("express-session")({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: store,
  })
);

// DB config
const db = require("./src/config/keys").mongoURI;
var store = new MongoDBStore({
  uri: db,
  mongooseConnection: mongoose.connection,
  collection: "mySessions",
});
// Catch errors
store.on("error", function (error) {
  console.log("error in STORE");
  console.log(error);
});
// Connect flash
app.use(flash());

//Global Vars
// app.use((res, req, next) => {
//   res.locals.success_msg = req.flash("success_msg");
//   res.locals.error_msg = req.flash("error_msg");
//   next();
// });

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected...."))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Route
app.use("/", router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
