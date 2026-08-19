const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ["Admin", "Employee"],
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["leave_applied", "leave_approved", "leave_rejected", "payroll_processed", "general"],
      default: "general",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema, "notifications");
