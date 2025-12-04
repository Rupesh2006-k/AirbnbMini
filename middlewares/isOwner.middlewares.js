const ListingModel = require("../models/listing.models");

let isOwner = async (req, res, next) =>{
  const { id } = req.params;
  const listing = await ListingModel.findById(id).populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // no owner in listing → safe fail
  if (!listing.owner) {
    req.flash("error", "This listing has no owner!");
    return res.redirect("/listings");
  }

  // no logged-in user → safe fail
  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not allowed to edit this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


module.exports = isOwner;
