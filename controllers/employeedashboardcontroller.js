const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");
const Notice = require("../models/notice");
const Profile = require("../models/profile");

const buildEmployeeDashboard = async (employee) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendanceToday = await Attendance.findOne({
    employeeId: employee._id,
    attendanceDate: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
  });

  const attendanceHistory = await Attendance.find({ employeeId: employee._id })
    .sort({ attendanceDate: -1 })
    .limit(5);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyAttendance = await Attendance.find({
    employeeId: employee._id,
    attendanceDate: {
      $gte: new Date(currentYear, currentMonth, 1),
      $lt: new Date(currentYear, currentMonth + 1, 1),
    },
  });

  const totalWorkingDays = monthlyAttendance.length;
  const presentDays = monthlyAttendance.filter((a) => a.status === "Present").length;
  const attendancePercentage = totalWorkingDays > 0 ? ((presentDays / totalWorkingDays) * 100).toFixed(2) : 0;

  const approvedLeaves = await Leave.countDocuments({ employeeId: employee._id, status: "Approved" });
  const pendingLeaves = await Leave.countDocuments({ employeeId: employee._id, status: "Pending" });
  const rejectedLeaves = await Leave.countDocuments({ employeeId: employee._id, status: "Rejected" });

  const latestPayroll = await Payroll.findOne({ employeeId: employee._id }).sort({ createdAt: -1 });
  const announcements = await Notice.find().sort({ createdAt: -1 }).limit(5);

  const leaveBalance = employee.leaveBalance != null ? employee.leaveBalance : approvedLeaves;

  return {
    employeeProfile: {
      id: employee._id,
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      gender: employee.gender,
      departmentId: employee.departmentId?._id || null,
      departmentName: employee.departmentId?.departmentName || "",
      designationId: employee.designationId?._id || null,
      designationName: employee.designationId?.designationName || "",
      profileImage: employee.profileImage || "",
      salary: employee.salary,
      leaveBalance,
    },
    todayAttendance: attendanceToday,
    recentNotices: announcements,
    attendanceHistory,
    attendancePercentage,
    leaves: {
      approved: approvedLeaves,
      pending: pendingLeaves,
      rejected: rejectedLeaves,
    },
    payroll: latestPayroll,
  };
};

const resolveEmployee = async (tokenUser) => {
  if (!tokenUser) return null;

  if (tokenUser.employeeId) {
    if (mongoose.Types.ObjectId.isValid(tokenUser.employeeId)) {
      const employeeById = await Employee.findById(tokenUser.employeeId)
        .populate("departmentId")
        .populate("designationId");
      if (employeeById) return employeeById;
    }

    const employeeByCode = await Employee.findOne({ employeeId: tokenUser.employeeId })
      .populate("departmentId")
      .populate("designationId");
    if (employeeByCode) return employeeByCode;
  }

  if (tokenUser.userId) {
    const profile = await Profile.findOne({ createdBy: tokenUser.userId });
    if (profile?.employeeId) {
      const employeeByProfile = await Employee.findOne({ employeeId: profile.employeeId })
        .populate("departmentId")
        .populate("designationId");
      if (employeeByProfile) return employeeByProfile;
    }
  }

  if (tokenUser.email) {
    const employeeByEmail = await Employee.findOne({ email: tokenUser.email })
      .populate("departmentId")
      .populate("designationId");
    if (employeeByEmail) return employeeByEmail;
  }
};

// ===============================
// Get Employee Dashboard
// ===============================
const getEmployeeDashboard = async (req, res) => {
  try {
    const { employeeId } = req.params;
    let employee = null;

    if (mongoose.Types.ObjectId.isValid(employeeId)) {
      employee = await Employee.findById(employeeId)
        .populate("departmentId")
        .populate("designationId");
    }

    if (!employee) {
      employee = await Employee.findOne({ employeeId })
        .populate("departmentId")
        .populate("designationId");
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const dashboard = await buildEmployeeDashboard(employee);

    res.status(200).json({
      success: true,
      message: "Employee Dashboard Data Retrieved Successfully",
      dashboard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCurrentEmployeeDashboard = async (req, res) => {
  try {
    const employee = await resolveEmployee(req.user);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found for current user",
      });
    }

    const dashboard = await buildEmployeeDashboard(employee);

    res.status(200).json({
      success: true,
      message: "Current Employee Dashboard Retrieved Successfully",
      dashboard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmployeeDashboard,
  getCurrentEmployeeDashboard,
};