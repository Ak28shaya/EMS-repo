const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    leaveType: {
      type: String,
      enum: [
        "Casual Leave",
        "Sick Leave",
        "Earned Leave",
        "Maternity Leave",
        "Paternity Leave",
        "Emergency Leave",
      ],
      required: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    totalDays: {
      type: Number,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    appliedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Leave ||
  mongoose.model("Leave", leaveSchema, "leave");