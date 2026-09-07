const mongoose = require("mongoose");

const employeeDashboardSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },

    attendancePercentage: {
      type: Number,
      default: 0,
    },

    presentDays: {
      type: Number,
      default: 0,
    },

    absentDays: {
      type: Number,
      default: 0,
    },

    approvedLeaves: {
      type: Number,
      default: 0,
    },

    pendingLeaves: {
      type: Number,
      default: 0,
    },

    rejectedLeaves: {
      type: Number,
      default: 0,
    },

    latestPayroll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payroll",
    },

    latestAnnouncement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announcement",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.EmployeeDashboard ||
  mongoose.model("EmployeeDashboard", employeeDashboardSchema);