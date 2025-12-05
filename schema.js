/** @format */

const Joi = require("joi");

let ListingSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  location: Joi.string(),
  price: Joi.number().min(0),
  country: Joi.string(),
  image: Joi.string().allow("", null),
});

let reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5),
    comment: Joi.string(),
  }),
});

module.exports = { ListingSchema, reviewSchema };
