/** @format */

const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
let flash = require("connect-flash");

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(flash());
app.set("view engine", "ejs");

app.get("/reg", (req, res) => {
  let { name = "random" } = req.query;
  req.session.name = name;

  if (name === "random") {
    req.flash("success", "well done chamepas");
  } else {
    req.flash("error", "some thing went wrong");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.render("page", { name: req.session.name });
});

app.get("/", (req, res) => res.send("Hello World! from session"));

app.listen(port, () => console.log(`Listening on port ${port}`));
