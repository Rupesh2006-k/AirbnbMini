const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middlewares/isLoggedIn.middlewares");
const isOwner = require("../middlewares/isOwner.middlewares");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { ListingSchema } = require("../schema");

let multer = require("multer");
let { cloudinary, storage } = require("../config/cloud.config");
let upload = multer({ storage });

const {
  listingIndexControllers,
  listingNewFormControllers,
  listingShowControllers,
  listingEditListingControllers,
  listingUpdateControllers,
  listingDeleteControllers,
  listingCreateListingControllers,
} = require("../controllers/listings.controllers");

// ------------------ VALIDATION ---------------------

const validateListing = (req, res, next) => {
  const { error } = ListingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// ------------------ ROUTES ---------------------

// INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingIndexControllers))
  .post(
    isLoggedIn,
    upload.single("image"),
    
    validateListing,
    wrapAsync(listingCreateListingControllers)
  );

// NEW
router.get("/new", isLoggedIn, listingNewFormControllers);

// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(wrapAsync(listingShowControllers))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingUpdateControllers)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingDeleteControllers));

// EDIT PAGE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingEditListingControllers)
);

module.exports = router;
