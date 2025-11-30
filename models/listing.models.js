
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
    set: (v) => (v === "" ? "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWx8ZW58MHx8MHx8fDA%3D" : v),
    default:'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWx8ZW58MHx8MHx8fDA%3D'  
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
});

let ListingModel = mongoose.model("Listing", listingSchema);

module.exports = ListingModel;
