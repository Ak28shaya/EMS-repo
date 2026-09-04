const mongoose = require("mongoose");
const Leave = require("../models/leave");
const Employee = require("../models/employee");
const Profile = require("../models/profile");
const Notification = require("../models/notification");

// ==========================
// Resolve Employee for Leave
// ==========================
const resolveEmployeeForLeave = async (req) => {
  const bodyEmployeeId = req.body.employeeId;

  if (bodyEmployeeId) {
    if (mongoose.Types.ObjectId.isValid(bodyEmployeeId)) {
      const employee = await Employee.findById(bodyEmployeeId);

      if (employee) return employee;
    }

    const employeeByCode = await Employee.findOne({
      employeeId: bodyEmployeeId,
    });

    if (employeeByCode) return employeeByCode;
  }

  const tokenEmployeeId = req.user?.employeeId;

  if (tokenEmployeeId) {
    if (mongoose.Types.ObjectId.isValid(tokenEmployeeId)) {
      const employee = await Employee.findById(tokenEmployeeId);

      if (employee) return employee;
    }

    const employeeByCode = await Employee.findOne({
      employeeId: tokenEmployeeId,
    });

    if (employeeByCode) return employeeByCode;
  }

  const email = req.user?.email;

  if (email) {
    const employeeByEmail = await Employee.findOne({
      email,
    });

    if (employeeByEmail) return employeeByEmail;
  }

  if (req.user?.id) {
    const profile = await Profile.findOne({
      createdBy: req.user.id,
    });

    if (profile?.employeeId) {
      const employeeByProfile = await Employee.findOne({
        employeeId: profile.employeeId,
      });

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
        message:
          "Leave type, start date, end date and reason are required",
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

    // Create notification
    try {
      await Notification.create({
        recipientType: "Admin",
        title: "New Leave Application",
        message: `${employee.firstName} ${employee.lastName} requested ${leaveType} leave for ${totalDays} day(s) (${fromDate} to ${toDate}).`,
        type: "leave_applied",
      });
    } catch (notifErr) {
      console.warn(
        "Failed to create admin notification:",
        notifErr
      );
    }

    return res.status(201).json({
      success: true,
      message: "Leave Applied Successfully",
      leave,
    });
  } catch (error) {
    console.error("Create Leave Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Active Leaves
// ==========================
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      isDeleted: false,
    })
      .populate("employeeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Leave List",
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error("Get Leaves Error:", error);

    return res.status(500).json({
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
    const leave = await Leave.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("employeeId");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      leave,
    });
  } catch (error) {
    console.error("Get Leave By ID Error:", error);

    return res.status(500).json({
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
    const leave = await Leave.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave Not Found",
      });
    }

    const updatedLeave = await Leave.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("employeeId");

    // Create notification when leave status changes
    if (
      req.body.status &&
      req.body.status !== leave.status
    ) {
      try {
        const statusText = req.body.status;

        const notifType =
          statusText === "Approved"
            ? "leave_approved"
            : statusText === "Rejected"
            ? "leave_rejected"
            : "general";

        const empName = updatedLeave.employeeId
          ? `${updatedLeave.employeeId.firstName || ""} ${
              updatedLeave.employeeId.lastName || ""
            }`.trim()
          : "Employee";

        await Notification.create({
          recipientType: "Employee",
          employeeId:
            updatedLeave.employeeId?._id ||
            updatedLeave.employeeId,
          title: `Leave Request ${statusText}`,
          message: `Your ${
            updatedLeave.leaveType
          } leave request from ${new Date(
            updatedLeave.fromDate
          )
            .toISOString()
            .split("T")[0]} to ${new Date(
            updatedLeave.toDate
          )
            .toISOString()
            .split("T")[0]} has been ${statusText.toLowerCase()} by Admin.`,
          type: notifType,
        });
      } catch (notifErr) {
        console.warn(
          "Failed to create employee notification:",
          notifErr
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Leave Updated Successfully",
      leave: updatedLeave,
    });
  } catch (error) {
    console.error("Update Leave Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Soft Delete Leave
// ==========================
const deleteLeave = async (req, res) => {
  try {
    console.log("🔥 SOFT DELETE LEAVE CALLED");

    const leave = await Leave.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave Not Found",
      });
    }

    // Soft delete instead of permanently deleting
    await Leave.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      }
    );

    return res.status(200).json({
      success: true,
      message: "Leave Deleted Successfully",
    });
  } catch (error) {
    console.error("Soft Delete Leave Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get My Active Leaves
// ==========================
const getMyLeaves = async (req, res) => {
  try {
    const tokenEmployeeId = req.user?.employeeId;

    if (!tokenEmployeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee identifier missing in token.",
      });
    }

    let employee = null;

    if (mongoose.Types.ObjectId.isValid(tokenEmployeeId)) {
      employee = await Employee.findById(
        tokenEmployeeId
      ).select(
        "_id employeeId firstName lastName email"
      );
    } else {
      employee = await Employee.findOne({
        employeeId: tokenEmployeeId,
      }).select(
        "_id employeeId firstName lastName email"
      );
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found for current user.",
      });
    }

    const leaves = await Leave.find({
      employeeId: employee._id,
      isDeleted: false,
    })
      .populate("employeeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error("Get My Leaves Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Export Controllers
// ==========================
module.exports = {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  getMyLeaves,
};