const mongoose = require("mongoose");

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
      required: true,
      trim: true,
    },

    headName: {
      type: String,
      required: true,
      trim: true,
    },

    headDesignation: {
      type: String,
      required: true,
      trim: true,
    },

    employeeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Department ||
  mongoose.model("Department", departmentSchema, "departments");