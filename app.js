/** @format */

const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

const connectDB = require("./config/db");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing.routes");
const reviewsRouter = require("./routes/reviews.routes");
const cookieParser = require("cookie-parser");
let session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./models/user.model");
let UserRouter = require('./routes/user.routes')
connectDB();

let sessionOptions = {
  secret: "kuchKhasBatHai",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
// Middleware

app.engine("ejs", ejsMate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser("code"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserModel.authenticate()));

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// Routes
app.get("/", (req, res) => {
  res.send(`Hello world`);
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user
  next();
});




app.use("/listings", listingRouter);
app.use("/listings", reviewsRouter);
app.use("/", UserRouter);

// 404 Handler
app.use((req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

// Start server
app.listen(port, () => console.log(`Server running at ${port}`));
