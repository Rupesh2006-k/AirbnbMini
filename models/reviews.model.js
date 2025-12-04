/** @format */

let mongoose = require("mongoose");

let reviewSchema = new mongoose.Schema({
  comment: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});

let ReviewModel = mongoose.model("review", reviewSchema);

module.exports = ReviewModel;
