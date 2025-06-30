require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const blogRoutes = require("./routes/blogRoutes.js");
const userRoutes = require("./routes/userRoutes.js");


const dbUrl = process.env.MONGO_URL;

const User = require("./models/user.js");


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


const sessionOptions = {
  secret: "OurSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   // users to get authenticate through LocalStrategy  //

passport.serializeUser(User.serializeUser());          // to serialise the user session when on website//
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.newUser = req.user;        // here we are storing the current user session //
  console.log(res.locals.newUser);
  next();
});


app.use("/", blogRoutes);
app.use("/", userRoutes);


main()
  .then(() => {
    console.log("working db");
  })
  .catch((e) => {
    console.log("db error", e);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
