const Leave = require("../models/Leave");

// ==========================
// Create Leave
// ==========================
const createLeave = async (req, res) => {
  try {
    const {
      employeeId,
      leaveType,
      fromDate,
      toDate,
      reason,
    } = req.body;

    if (
      !employeeId ||
      !leaveType ||
      !fromDate ||
      !toDate ||
      !reason
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({
        message: "From Date cannot be greater than To Date",
      });
    }

    const totalDays =
      Math.floor(
        (new Date(toDate) - new Date(fromDate)) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const leave = await Leave.create({
      employeeId,
      leaveType,
      fromDate,
      toDate,
      totalDays,
      reason,
    });

    res.status(201).json({
      message: "Leave Applied Successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
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
      message: "Leave List",
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
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
        message: "Leave Not Found",
      });
    }

    res.status(200).json({
      leave,
    });
  } catch (error) {
    res.status(500).json({
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
      message: "Leave Updated Successfully",
      leave: updatedLeave,
    });
  } catch (error) {
    res.status(500).json({
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
        message: "Leave Not Found",
      });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Leave Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
};