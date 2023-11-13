const { Schema, model } = require("mongoose");

const JsonDocument = new Schema(
  {
    _id: String,
    data: Object,
  },
  { collection: "JsonFiles" }
);

module.exports = model("JsonDocument", JsonDocument, "JsonFiles");
