const express = require("express");
const router = express.Router({ mergeParams: true });

let wrapAsync = require("../utils/wrapAsync");
const ListingModel = require("../models/listing.models");
let ExpressError = require("../utils/ExpressError");
const { ListingSchema, reviewSchema } = require("../schema");
let ReviewModel = require("../models/reviews.model");

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

    res.redirect(`/listings/${listing._id}`);
  })
);

router.delete(
  "/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await ListingModel.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    await ReviewModel.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
