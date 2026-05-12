const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ApiKey", apiKeySchema);
