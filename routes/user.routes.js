/** @format */
const express = require("express");
const UserModel = require("../models/user.model");
const router = express.Router();
let passport = require("passport");
const saveRedirectUrl = require("../middlewares/saveRedirectUrl.middlewares");
router.get("/signup", (req, res) => {
  res.render("users/signup");
});
router.post("/signup", async (req, res, next) => {
  try {
    let { email, password, username } = req.body;

    const newUser = new UserModel({ email, username });

    const registeredUser = await UserModel.register(newUser, password);
    console.log(registeredUser);
    req.logIn(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Account created successfully!");
      res.redirect("/listings");
    });
  } catch (err) {
    console.log(err);
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    // res.redirect("/listings");
    req.flash("success", "welcome");
    res.redirect(res.locals.redirectUrl);
  },
);

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
  });
  req.flash("success", " logout");
  res.redirect("/listings");
});

module.exports = router;
