const mongoose = require("mongoose");

//CONNECTING TO MONGODB
const connectDatabase = () =>
  mongoose.connect(process.env.DB).then(() => {
    console.log("Connected to MongoDB");
  });
module.exports = connectDatabase;
