const mongoose = require("mongoose");

const fileModel = new mongoose.Schema(
  {
    name: String,
    file: String,
    idx: Number,
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileModel);
module.exports = File;
