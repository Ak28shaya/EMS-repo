const Attendance = require("../models/attendance");

// Create Attendance
const createAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);

    res.status(201).json({
      message: "Attendance Marked Successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Attendance
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate(
      "employeeId",
      "employeeId firstName lastName"
    );

    const result = attendance.map((item) => ({
      _id: item._id,
      employeeCode: item.employeeId?.employeeId,
      employeeName: `${item.employeeId?.firstName} ${item.employeeId?.lastName}`,
      attendanceDate: item.attendanceDate,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      status: item.status,
      createdAt: item.createdAt,
    }));

    res.status(200).json({
      message: "Attendance List",
      count: result.length,
      attendance: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
};