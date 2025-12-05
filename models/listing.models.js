/** @format */
let reviewModel = require("./reviews.model");
let mongoose = require("mongoose");

let listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await reviewModel.deleteMany({ _id: { $in: listing.reviews } });
  }
});

let ListingModel = mongoose.model("Listing", listingSchema);

module.exports = ListingModel;
