const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyEmail: {
      type: String,
      required: true,
      trim: true,
    },

    companyPhone: {
      type: String,
      required: true,
      trim: true,
    },

    companyAddress: {
      type: String,
      required: true,
      trim: true,
    },

    companyWebsite: {
      type: String,
      default: "",
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema, "settings");