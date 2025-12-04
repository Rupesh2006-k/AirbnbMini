const ReviewModel = require("../models/reviews.model");
let isReviewAuthor = async (req, res, next) => {
  let { id  , reviewId } = req.params;
  let review = await ReviewModel.findById(id);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "some thing went wrong author");

    return res.redirect(`/listings/${id}`);
  }
  next()
};

module.exports = isReviewAuthor;
