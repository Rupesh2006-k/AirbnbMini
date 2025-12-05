const ListingModel = require("../models/listing.models");

// SHOW ALL LISTINGS
let listingIndexControllers = async (req, res) => {
  const listing = await ListingModel.find();
  res.render("listings/index.ejs", { listing });
};

// NEW FORM
let listingNewFormControllers = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW DETAILS
let listingShowControllers = async (req, res) => {
  let { id } = req.params;
  let listingDetail = await ListingModel.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listingDetail) {
    req.flash("error", "That listing does not exist.");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listingDetail });
};

// CREATE LISTING (FULL FIX)
let listingCreateListingControllers = async (req, res) => {
  let newList = new ListingModel(req.body);

  if (req.file) {
    newList.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  newList.owner = req.user._id;
  await newList.save();

  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// EDIT PAGE
let listingEditListingControllers = async (req, res) => {
  const { id } = req.params;
  const listingEdit = await ListingModel.findById(id);

  if (!listingEdit) {
    req.flash("error", "Listing does not exist.");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listingEdit });
};

// UPDATE LISTING (FULL FIX)
let listingUpdateControllers = async (req, res) => {
  const { id } = req.params;

  const listing = await ListingModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// DELETE LISTING
let listingDeleteControllers = async (req, res) => {
  const { id } = req.params;

  await ListingModel.findByIdAndDelete(id);
  req.flash("success", "Listing deleted.");

  res.redirect("/listings");
};

module.exports = {
  listingIndexControllers,
  listingNewFormControllers,
  listingShowControllers,
  listingCreateListingControllers,
  listingEditListingControllers,
  listingUpdateControllers,
  listingDeleteControllers,
};
