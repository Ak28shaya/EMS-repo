const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const Profile = require("../models/profile");
const mongoose = require("mongoose");

const resolveEmployeeFromToken = async (req) => {
  const tokenUser = req.user || {};
  let employee = null;

  if (tokenUser.employeeId) {
    if (mongoose.Types.ObjectId.isValid(tokenUser.employeeId)) {
      employee = await Employee.findById(tokenUser.employeeId);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: tokenUser.employeeId });
    }
  }

  if (!employee && tokenUser.userId) {
    const profile = await Profile.findOne({ createdBy: tokenUser.userId });
    if (profile?.employeeId) {
      employee = await Employee.findOne({ employeeId: profile.employeeId });
    }
  }

  if (!employee && tokenUser.email) {
    employee = await Employee.findOne({ email: tokenUser.email });
  }

  return employee;
};

// ===========================
// Apply Leave
// ===========================
const applyLeave = async (req, res) => {

  try {

    const {
      employeeId,
      leaveType,
      fromDate,
      toDate,
      reason,
    } = req.body;

    let resolvedEmployeeId = employeeId;
    if (!resolvedEmployeeId) {
      const employee = await resolveEmployeeFromToken(req);
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: "Unable to determine employee for current user.",
        });
      }
      resolvedEmployeeId = employee._id;
    }

    if (
      !resolvedEmployeeId ||
      !leaveType ||
      !fromDate ||
      !toDate ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({
        success: false,
        message: "From Date cannot be greater than To Date.",
      });
    }

    const oneDay = 1000 * 60 * 60 * 24;

    const totalDays =
      Math.floor(
        (new Date(toDate) - new Date(fromDate)) / oneDay
      ) + 1;

    const leave = await Leave.create({
      employeeId: resolvedEmployeeId,
      leaveType,
      fromDate,
      toDate,
      totalDays,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully.",
      leave,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



// ===========================
// Get All Leave Requests
// ===========================
const getAllLeaves = async (req, res) => {

  try {

    const leaves = await Leave.find()
      .populate("employeeId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// ===========================
// Get Leave By Employee
// ===========================
const getEmployeeLeaves = async (req, res) => {

  try {

    const leaves = await Leave.find({
      employeeId: req.params.employeeId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      leaves,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// ===========================
// Update Leave Status
// ===========================
const updateLeaveStatus = async (req, res) => {

  try {

    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Status",
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Leave ${status} Successfully.`,
      leave,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===========================
// Delete Leave
// ===========================
const deleteLeave = async (req, res) => {
  try {

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found.",
      });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Leave deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===========================
// Get My Leaves
// ===========================
const getMyLeaves = async (req, res) => {
  try {
    const employee = await resolveEmployeeFromToken(req);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const leaves = await Leave.find({
      employeeId: employee._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
  deleteLeave,
};