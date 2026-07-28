const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Designation = require("../models/Designation");
const Attendance = require("../models/Attendance");
const Notice = require("../models/Notice");

// =============================
// Admin Dashboard
// =============================
const getAdminDashboard = async (req, res) => {
  try {
    // Total Counts
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalDesignations = await Designation.countDocuments();
    const totalNotices = await Notice.countDocuments();

    // Today's Date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Attendance Summary
    const presentToday = await Attendance.countDocuments({
      attendanceDate: { $gte: today, $lt: tomorrow },
      status: "Present",
    });

    const absentToday = await Attendance.countDocuments({
      attendanceDate: { $gte: today, $lt: tomorrow },
      status: "Absent",
    });

    const leaveToday = await Attendance.countDocuments({
      attendanceDate: { $gte: today, $lt: tomorrow },
      status: "Leave",
    });

    // Recent Employees
    const recentEmployees = await Employee.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("employeeId firstName lastName");

    // Recent Notices
    const recentNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    res.status(200).json({
      success: true,
      message: "Admin Dashboard Data Retrieved Successfully",
      dashboard: {
        totalEmployees,
        totalDepartments,
        totalDesignations,
        totalNotices,
        presentToday,
        absentToday,
        leaveToday,
        recentEmployees,
        recentNotices,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load Admin Dashboard",
      error: error.message,
    });
  }
};

// =============================
// Employee Dashboard
// =============================
const getEmployeeDashboard = async (req, res) => {
  try {
    const { employeeId } = req.params;

    console.log("=================================");
    console.log("Employee ID from URL:", employeeId);

    const employee = await Employee.findOne({ employeeId })
      .populate("departmentId", "departmentName")
      .populate("designationId", "designationName");

    console.log("Employee Result:", employee);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Today's Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayAttendance = await Attendance.findOne({
      employeeId: employee._id,
      attendanceDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    console.log("Attendance Result:", todayAttendance);

    // Latest Notices
    const recentNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title description createdAt");

    res.status(200).json({
      success: true,
      message: "Employee Dashboard Data Retrieved Successfully",
      dashboard: {
        employeeProfile: employee,
        todayAttendance,
        recentNotices,
      },
    });
  } catch (error) {
    console.error(error); // <-- IMPORTANT
    res.status(500).json({
      success: false,
      message: "Failed to load Employee Dashboard",
      error: error.message,
    });
  }
};
module.exports = {
  getAdminDashboard,
  getEmployeeDashboard,
};