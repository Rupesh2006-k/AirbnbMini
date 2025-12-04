/** @format */

const ListingModel = require("../models/listing.models");
let ReviewModel = require("../models/reviews.model");

let createReviewsControllers = async (req, res) => {
  let listing = await ListingModel.findById(req.params.id);

  let review = new ReviewModel(req.body.review);

  review.author = req.user._id;
  listing.reviews.push(review);

  await review.save();
  await listing.save();

  console.log("new review is added");

  res.redirect(`/listings/${listing._id}`);
};

let deleteReviewControllers = async (req, res) => {
  const { id, reviewId } = req.params;

  await ListingModel.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await ReviewModel.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
};

module.exports = { createReviewsControllers, deleteReviewControllers };
