/** @format */

const ListingModel = require("../models/listing.models");

let listingIndexControllers = async (req, res) => {
  const listing = await ListingModel.find();
  res.render("listings/index.ejs", { listing });
};

let listingNewFormControllers = (req, res) => {
  res.render("listings/new.ejs");
};

let listingShowControllers = async (req, res) => {
  let { id } = req.params;
  let listingDetail = await ListingModel.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listingDetail) {
    res.flash("error", "that listing you want see does not exist ");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listingDetail });
};

let listingCreateListingControllers = async (req, res) => {
  let newList = await ListingModel.create(req.body);
  newList.owner = req.user._id;
  await newList.save();
  req.flash("success", "new listing is created");
  res.redirect("/listings");
};

// let listingEditListingControllers = async (req, res) => {
//   let { id } = req.params;
//   let leastingEdit = await ListingModel.findById(id);
//   if (!leastingEdit) {
//     req.flash("error", "that listisng you want to edit again does not exist");
//     return res.redirect("/listings");
//   }
//   res.render("listings/edit.ejs", { leastingEdit });
// };


let listingEditListingControllers = async (req, res) => {
  const { id } = req.params;
  const listingEdit = await ListingModel.findById(id);

  if (!listingEdit) {
    req.flash("error", "The listing you want to edit does not exist.");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listingEdit });
};


// let listingUpdateControllers = async (req, res) => {
//   let { id } = req.params;

//   await ListingModel.findByIdAndUpdate(id, { ...req.body.listing });
//   res.flash("success", " good ");
//   res.redirect(`/listings/${id}`);
// };

let listingUpdateControllers = async (req, res) => {
  const { id } = req.params;

  await ListingModel.findByIdAndUpdate(id, { ...req.body.listing });

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};


let listingDeleteControllers = async (req, res) => {
  const { id } = req.params;
  await ListingModel.findByIdAndDelete(id);
  req.flash("success", " listing deleted");
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
