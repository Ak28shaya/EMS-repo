const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    attendanceDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Half Day"],
      required: true,
    },

    checkInTime: {
      type: String,
      default: null,
    },

    checkOutTime: {
      type: String,
      default: null,
    },

    workedHours: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Attendance ||
  mongoose.model("Attendance", attendanceSchema, "attendances");
