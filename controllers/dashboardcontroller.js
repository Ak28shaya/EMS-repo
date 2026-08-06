const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Designation = require("../models/Designation");
const Attendance = require("../models/Attendance");
const Notice = require("../models/Notice");
const Payroll = require("../models/Payroll");
const User = require("../models/User");
const Role = require("../models/Role");

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
    const totalPayrolls = await Payroll.countDocuments();

    const managerRole = await Role.findOne({ name: /manager/i });
    const totalManagers = managerRole
      ? await User.countDocuments({ role: managerRole._id })
      : 0;

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
        totalPayrolls,
        totalManagers,
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
// Get dashboard for currently authenticated user (by token)
const getCurrentEmployeeDashboard = async (req, res) => {
  try {
    const tokenUser = req.user || {};

    // Resolve employee using token.employeeId, Profile.createdBy, or token email
    let employee = null;
    const Profile = require("../models/profile");
    if (tokenUser.employeeId) {
      employee = await Employee.findById(tokenUser.employeeId)
        .populate("departmentId", "departmentName")
        .populate("designationId", "designationName");
    }

    if (!employee && tokenUser.userId) {
      const profile = await Profile.findOne({ createdBy: tokenUser.userId });
      if (profile && profile.employeeId) {
        employee = await Employee.findOne({ employeeId: profile.employeeId })
          .populate("departmentId", "departmentName")
          .populate("designationId", "designationName");
      }
    }

    if (!employee && tokenUser.email) {
      employee = await Employee.findOne({ email: tokenUser.email })
        .populate("departmentId", "departmentName")
        .populate("designationId", "designationName");
    }

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found for current user" });
    }

    // Today's Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayAttendance = await Attendance.findOne({
      employeeId: employee._id,
      attendanceDate: { $gte: today, $lt: tomorrow },
    });

    const recentNotices = await Notice.find().sort({ createdAt: -1 }).limit(5).select("title description createdAt");

    res.status(200).json({
      success: true,
      message: "Current Employee Dashboard Retrieved",
      dashboard: {
        employeeProfile: employee,
        todayAttendance,
        recentNotices,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load current employee dashboard", error: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  getEmployeeDashboard,
  getCurrentEmployeeDashboard,
};