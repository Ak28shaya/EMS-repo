const Attendance = require("../models/attendance");

// Create Attendance
const createAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      attendanceDate,
      status,
    } = req.body;

    // Required Field Validations
    if (!employeeId) {
      return res.status(400).json({
        message: "Employee is required",
      });
    }

    if (!attendanceDate) {
      return res.status(400).json({
        message: "Attendance Date is required",
      });
    }
    if (!status) {
      return res.status(400).json({
        message: "Attendance Status is required",
      });
    }

    // Status Validation
    const validStatus = ["Present", "Absent", "Leave", "Half Day"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid Attendance Status. Status must be Present, Absent, Leave, or Half Day.",
      });
    }

    // Create Attendance
    const attendance = await Attendance.create({
      employeeId,
      attendanceDate,
      status,
    });

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

// Update Attendance
const updateAttendance = async (req, res) => {
  try {
    const { employeeId, attendanceDate, status } = req.body;

    // Check if Attendance Exists
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance Record Not Found",
      });
    }

    // Required Field Validations
    if (!employeeId) {
      return res.status(400).json({
        message: "Employee is required",
      });
    }

    if (!attendanceDate) {
      return res.status(400).json({
        message: "Attendance Date is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Attendance Status is required",
      });
    }

    // Status Validation
    const validStatus = ["Present", "Absent", "Leave", "Half Day"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid Attendance Status. Status must be Present, Absent, Leave, or Half Day.",
      });
    }

    // Update Attendance
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        employeeId,
        attendanceDate,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Attendance Updated Successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Delete Attendance
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance Record Not Found",
      });
    }

    await Attendance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Attendance Deleted Successfully",
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
  updateAttendance,
  deleteAttendance
};