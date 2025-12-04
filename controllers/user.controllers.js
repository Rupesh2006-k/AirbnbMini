const UserModel = require("../models/user.model");

let signupControllers = async (req, res, next) => {
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
}

let loginControllers =  (req, res) => {
    req.flash("success", "welcome");
    res.redirect(res.locals.redirectUrl);
  }

  let logoutControllers = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
  });
  req.flash("success", " logout");
  res.redirect("/listings");
}
module.exports = {signupControllers , loginControllers ,logoutControllers }