/** @format */

const express = require("express");
const router = express.Router();
let isLoggedIn = require("../middlewares/isLoggedIn.middlewares");
let wrapAsync = require("../utils/wrapAsync");
const ListingModel = require("../models/listing.models");
let path = require("path");
let ExpressError = require("../utils/ExpressError");
const { ListingSchema, reviewSchema } = require("../schema");
let ReviewModel = require("../models/reviews.model");
let flash = require("connect-flash");
// listing index
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listing = await ListingModel.find();
    res.render("listings/index.ejs", { listing });
  }),
);

// new listing form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// listing show
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  let listingDetail = await ListingModel.findById(id).populate("reviews");
  if (!listingDetail) {
    res.flash("error", "that listing you want see does not exist ");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listingDetail });
});

// validate listing
let validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((val) => val.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// create listing
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    let newList = await ListingModel.create(req.body);
    req.flash("success", "new listing is created");
    res.redirect("/listings");
  }),
);

// edit listing page
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let leastingEdit = await ListingModel.findById(id);
  if (!leastingEdit) {
    req.flash("error", "that listisng you want to edit again does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { leastingEdit });
});

// update listing
router.put("/:id", isLoggedIn, validateListing, async (req, res) => {
  let { id } = req.params;
  await ListingModel.findByIdAndUpdate(id, req.body);
  res.redirect(`/listings/${id}`);
});

// delete listing
router.delete("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await ListingModel.findByIdAndDelete(id);
  req.flash("success", " listing deleted");
  res.redirect("/listings");
});

// review validation
let validateReviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((val) => val.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// ⭐⭐⭐ FIXED REVIEW ROUTE ⭐⭐⭐
router.post(
  "/:id/reviews",
  validateReviews,
  wrapAsync(async (req, res) => {
    let listing = await ListingModel.findById(req.params.id);

    let review = new ReviewModel(req.body.review);

    listing.reviews.push(review);

    await review.save();
    await listing.save();

    console.log("new review is added");
    req.flash("success", "new review added");

    res.redirect(`/listings/${listing._id}`);
  }),
);

router.delete(
  "/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await ListingModel.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    req.flash("success", "review deleted");
    await ReviewModel.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
