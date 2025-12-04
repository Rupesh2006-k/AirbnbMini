/** @format */
let reviewModel = require("./reviews.model");
let mongoose = require("mongoose");

let listingSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    set: (v) =>
      v === ""
        ? "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?w=600&auto=format&fit=crop&q=60"
        : v,
    default:
      "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?w=600&auto=format&fit=crop&q=60",
  },
  price: {
    type: Number,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await reviewModel.deleteMany({ _id: { $in: listing.reviews } });
  }
});

let ListingModel = mongoose.model("Listing", listingSchema);

module.exports = ListingModel;
