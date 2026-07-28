const mongoose = require("mongoose");

console.log("Loading Department model...");
console.trace();

console.log("Department model loaded");


const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
console.log("Department models:", mongoose.modelNames());

module.exports =
  mongoose.models.Department ||
  mongoose.model("Department", departmentSchema, "departments");