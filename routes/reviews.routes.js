/** @format */

const express = require("express");
const router = express.Router({ mergeParams: true });

let wrapAsync = require("../utils/wrapAsync");
let ExpressError = require("../utils/ExpressError");
const { ListingSchema, reviewSchema } = require("../schema");
const isLoggedIn = require("../middlewares/isLoggedIn.middlewares");
const isReviewAuthor = require("../middlewares/isReviewAuthor.middlewares");
const { createReviewsControllers, deleteReviewControllers } = require("../controllers/review.controllers");

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
  isLoggedIn,
  validateReviews,
  wrapAsync(createReviewsControllers),
);

router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReviewControllers),
);

module.exports = router;
