const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.Role ||
  mongoose.model("Role", roleSchema, "roles");