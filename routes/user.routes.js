const express = require("express");
const router = express.Router();
let passport = require("passport");
const saveRedirectUrl = require("../middlewares/saveRedirectUrl.middlewares");
const {
  signupControllers,
  loginControllers,
  logoutControllers,
} = require("../controllers/user.controllers");
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", signupControllers);

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
  loginControllers,
);

router.get("/logout", logoutControllers);

module.exports = router;
