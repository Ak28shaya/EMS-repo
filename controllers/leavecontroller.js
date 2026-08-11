const mongoose = require("mongoose");
const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const Profile = require("../models/profile");

const resolveEmployeeForLeave = async (req) => {
  const bodyEmployeeId = req.body.employeeId;
  if (bodyEmployeeId) {
    if (mongoose.Types.ObjectId.isValid(bodyEmployeeId)) {
      const employee = await Employee.findById(bodyEmployeeId);
      if (employee) return employee;
    }
    const employeeByCode = await Employee.findOne({ employeeId: bodyEmployeeId });
    if (employeeByCode) return employeeByCode;
  }

  const tokenEmployeeId = req.user?.employeeId;
  if (tokenEmployeeId) {
    if (mongoose.Types.ObjectId.isValid(tokenEmployeeId)) {
      const employee = await Employee.findById(tokenEmployeeId);
      if (employee) return employee;
    }
    const employeeByCode = await Employee.findOne({ employeeId: tokenEmployeeId });
    if (employeeByCode) return employeeByCode;
  }

  const email = req.user?.email;
  if (email) {
    const employeeByEmail = await Employee.findOne({ email });
    if (employeeByEmail) return employeeByEmail;
  }

  if (req.user?.id) {
    const profile = await Profile.findOne({ createdBy: req.user.id });
    if (profile?.employeeId) {
      const employeeByProfile = await Employee.findOne({ employeeId: profile.employeeId });
      if (employeeByProfile) return employeeByProfile;
    }
  }

  return null;
};

// ==========================
// Create Leave
// ==========================
const createLeave = async (req, res) => {
  try {
    const {
      employeeId: bodyEmployeeId,
      leaveType,
      fromDate,
      toDate,
      reason,
    } = req.body;

    const tokenEmployeeId = req.user?.employeeId;
    const employeeId = bodyEmployeeId || tokenEmployeeId;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "Leave type, start date, end date and reason are required",
      });
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({
        success: false,
        message: "From Date cannot be greater than To Date",
      });
    }

    const employee = await resolveEmployeeForLeave(req);
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Unable to resolve employee for leave request",
      });
    }

    const totalDays =
      Math.floor(
        (new Date(toDate) - new Date(fromDate)) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const leave = await Leave.create({
      employeeId: employee._id,
      leaveType,
      fromDate,
      toDate,
      totalDays,
      reason,
    });

    res.status(201).json({
      success: true,
      success: true,
      message: "Leave Applied Successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Leaves
// ==========================
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      success: true,
      message: "Leave List",
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Leave By ID
// ==========================
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("employeeId");

    if (!leave) {
      return res.status(404).json({
        success: false,
        success: false,
        message: "Leave Not Found",
      });
    }

    res.status(200).json({
      success: true,
      success: true,
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Leave
// ==========================
const updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        success: false,
        message: "Leave Not Found",
      });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("employeeId");

    res.status(200).json({
      success: true,
      success: true,
      message: "Leave Updated Successfully",
      leave: updatedLeave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Leave
// ==========================
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        success: false,
        message: "Leave Not Found",
      });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      success: true,
      message: "Leave Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      success: false,
      message: error.message,
    });
  }
};

// Get leaves for the currently authenticated user
const getMyLeaves = async (req, res) => {
  try {
    const tokenEmployeeId = req.user?.employeeId;

    if (!tokenEmployeeId) {
      return res.status(400).json({ success: false, message: "Employee identifier missing in token." });
    }

    let employee = null;
    const mongoose = require("mongoose");
    if (mongoose.Types.ObjectId.isValid(tokenEmployeeId)) {
      employee = await Employee.findById(tokenEmployeeId).select("_id employeeId firstName lastName email");
    } else {
      employee = await Employee.findOne({ employeeId: tokenEmployeeId }).select("_id employeeId firstName lastName email");
    }

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found for current user." });
    }

    const leaves = await Leave.find({ employeeId: employee._id }).populate("employeeId").sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  getMyLeaves,
};