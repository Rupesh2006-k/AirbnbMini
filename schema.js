/** @format */

const Joi = require("joi");

let ListingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  price: Joi.number().required().min(0),
  country: Joi.string().required(),
  image: Joi.string().allow("", null),
});

let reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

module.exports = { ListingSchema, reviewSchema };
