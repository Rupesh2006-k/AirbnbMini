/** @format */

let mongoose = require("mongoose");

let connectDB = async () => {
  try {
    let res = await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
    console.log("MongoDB Connected 🚀");

    return res;
  } catch (error) {
    console.error("MongoDB Connection Failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
