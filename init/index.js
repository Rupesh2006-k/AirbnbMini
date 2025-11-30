require("dotenv").config();
let connectDB = require("../config/db");
const ListingModel = require("../models/listing.models");
let data = require("./data");

let initData = async () => {
  try {
    await connectDB(); // IMPORTANT

    await ListingModel.deleteMany(); // optional
    await ListingModel.insertMany(data.data); // or data (depends on export)

    console.log("Data inserted successfully!");
  } catch (err) {
    console.log("Error:", err);
  }
};

initData();
