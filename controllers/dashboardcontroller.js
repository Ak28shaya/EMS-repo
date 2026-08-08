const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Designation = require("../models/Designation");
const Attendance = require("../models/Attendance");
const Notice = require("../models/Notice");
const Payroll = require("../models/Payroll");
const User = require("../models/User");
const Role = require("../models/Role");

// ============================
// Admin Dashboard
// ============================
const getAdminDashboard = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalDesignations = await Designation.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const totalPayrolls = await Payroll.countDocuments();

    const managerRole = await Role.findOne({ name: "manager" });

    const totalManagers = managerRole
      ? await User.countDocuments({ role: managerRole._id })
      : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

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

    const recentEmployees = await Employee.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ============================
// Employee Dashboard
// ============================
const getEmployeeDashboard = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      employeeId: req.params.employeeId,
    })
      .populate("departmentId")
      .populate("designationId");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

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

    const recentNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        employee,
        todayAttendance,
        recentNotices,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getEmployeeDashboard,
};