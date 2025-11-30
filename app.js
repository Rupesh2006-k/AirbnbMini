/** @format */
let wrapAsync = require("./utils/wrapAsync");
const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
let connectDB = require("./config/db");
const ListingModel = require("./models/listing.models");
connectDB();
let path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
let ejsMate = require("ejs-mate");
let ExpressError = require("./utils/ExpressError");
const ListingSchema = require("./schema");

app.engine("ejs", ejsMate);
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// listing
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const listing = await ListingModel.find();
    res.render("listings/index.ejs", { listing });
  }),
);

// new route
app.get("/listings/new", async (req, res) => {
  res.render("listings/new.ejs");
});

// new show
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listingDetail = await ListingModel.findById(id);

  res.render("listings/show.ejs", { listingDetail });
});

let validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((val)=>val.message).join(",")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// create route hai ye
app.post("/listings", validateListing, async (req, res) => {
  // let result = ListingSchema.validate(req.body);
  // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }

  let newList = await ListingModel.create(req.body);

  // if (!newList.title) {
  //   throw new ExpressError(400, "titil is meassing ");
  // }
  // if (!newList.description) {
  //   throw new ExpressError(400, "discription is meassing ");
  // }
  // if (!newList.location) {
  //   throw new ExpressError(400, "location is meassing ");
  // }
  // if (!newList.country) {
  //   throw new ExpressError(400, "country  is meassing ");
  // }
  res.redirect("/listings");
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let leastingEdit = await ListingModel.findById(id);
  res.render("listings/edit.ejs", { leastingEdit });
});

// eidt or upladte route
app.put("/listings/:id", validateListing, async (req, res) => {
  let { id } = req.params;
  let ans = await ListingModel.findByIdAndUpdate(id, req.body);
  res.redirect(`/listings/${id}`);
});

// Delete route

app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  let ans = await ListingModel.findByIdAndDelete(id);
  console.log(ans);
  res.redirect("/listings");
});

app.use((req, res, next) => {
  next(new ExpressError(404, "page  not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some thing went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
