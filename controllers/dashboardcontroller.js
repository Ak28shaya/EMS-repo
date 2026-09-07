const mongoose = require("mongoose");
const Employee = require("../models/employee");
const Department = require("../models/department");
const Designation = require("../models/designation");
const Attendance = require("../models/attendance");
const Notice = require("../models/notice");
const Payroll = require("../models/payroll");
const User = require("../models/user");
const Role = require("../models/role");

// ============================
// Admin Dashboard
// ============================
const getAdminDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [
      totalEmployees,
      totalDepartments,
      totalDesignations,
      totalNotices,
      totalPayrolls,
      managerRole,
      presentToday,
      absentToday,
      leaveToday,
      recentEmployees,
      recentNotices,
    ] = await Promise.all([
      Employee.countDocuments().lean(),
      Department.countDocuments().lean(),
      Designation.countDocuments().lean(),
      Notice.countDocuments().lean(),
      Payroll.countDocuments().lean(),
      Role.findOne({ name: { $regex: "^manager$", $options: "i" } }).lean(),
      Attendance.countDocuments({
        attendanceDate: { $gte: today, $lt: tomorrow },
        status: "Present",
      }).lean(),
      Attendance.countDocuments({
        attendanceDate: { $gte: today, $lt: tomorrow },
        status: "Absent",
      }).lean(),
      Attendance.countDocuments({
        attendanceDate: { $gte: today, $lt: tomorrow },
        status: "Leave",
      }).lean(),
      Employee.find().sort({ createdAt: -1 }).limit(5).lean(),
      Notice.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const totalManagers = managerRole
      ? await User.countDocuments({ role: managerRole._id }).lean()
      : 0;

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

const Profile = require("../models/profile");

// ============================
// Employee Dashboard
// ============================
const getEmployeeDashboard = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentUserEmployeeId = req.user?.employeeId;

    let employee = null;

    if (employeeId && employeeId !== "me") {
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
    }

    if (!employee && currentUserEmployeeId) {
      if (mongoose.Types.ObjectId.isValid(currentUserEmployeeId)) {
        employee = await Employee.findById(currentUserEmployeeId)
          .populate("departmentId")
          .populate("designationId");
      }

      if (!employee) {
        employee = await Employee.findOne({ employeeId: currentUserEmployeeId })
          .populate("departmentId")
          .populate("designationId");
      }
    }

    const targetUserId = req.user?.userId || req.user?._id || req.user?.id;
    if (!employee && targetUserId) {
      const profile = await Profile.findOne({ createdBy: targetUserId });
      if (profile?.employeeId) {
        employee = await Employee.findOne({ employeeId: profile.employeeId })
          .populate("departmentId")
          .populate("designationId");
      }
    }

    if (!employee && req.user?.email) {
      employee = await Employee.findOne({ email: req.user.email })
        .populate("departmentId")
        .populate("designationId");
    }

    const recentNotices = await Notice.find().sort({ createdAt: -1 }).limit(5).lean();

    if (!employee) {
      return res.status(200).json({
        success: true,
        message: "No specific employee profile found, returning general dashboard data",
        dashboard: {
          employee: null,
          employeeProfile: {
            firstName: req.user?.name || "Employee",
            lastName: "",
            email: req.user?.email || "",
            leaveBalance: 0,
            salary: 0,
          },
          todayAttendance: null,
          recentNotices,
        },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const Leave = require("../models/leave");

    const [todayAttendance, approvedLeaves] = await Promise.all([
      Attendance.findOne({
        employeeId: employee._id,
        attendanceDate: {
          $gte: today,
          $lt: tomorrow,
        },
      }).lean(),
      Leave.find({ employeeId: employee._id, status: "Approved" }).lean(),
    ]);

    const leaveDaysTaken = approvedLeaves.reduce((sum, l) => sum + (l.totalDays || 1), 0);
    const leaveBalance = Math.max(0, 18 - leaveDaysTaken);

    const employeeObj = employee.toObject ? employee.toObject() : employee;
    const employeeProfile = {
      ...employeeObj,
      designationName: employee.designationId?.designationName || "Staff Member",
      departmentName: employee.departmentId?.departmentName || "General",
      salary: employee.salary || 0,
      leaveBalance: leaveBalance,
    };

    res.status(200).json({
      success: true,
      dashboard: {
        employee,
        employeeProfile,
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