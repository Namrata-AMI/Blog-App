const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const router = express.Router();


router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});



router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Blog-App!");
      res.redirect("/");

    });

  } 
  
  catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});



router.get("/login", (req, res) => {
  res.render("login.ejs");
});



router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true,}),(req, res)=>{
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.redirectUrl || "/";
    res.redirect(redirectUrl);
  }
);



router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You logged out!");
    res.redirect("/");
  });
});

module.exports = router;
