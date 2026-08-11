const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const Profile = require("../models/profile");
const mongoose = require("mongoose");

const attendanceEmployeePopulate = {
  path: "employeeId",
  select: "employeeId firstName lastName email departmentId",
  populate: {
    path: "departmentId",
    select: "departmentName",
  },
};

const createAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      attendanceDate,
      status,
      checkInTime,
      checkOutTime,
      workedHours,
      notes,
    } = req.body;

    // Required validation
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    if (!attendanceDate) {
      return res.status(400).json({
        success: false,
        message: "Attendance Date is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Attendance Status is required",
      });
    }

    // Validate status
    const validStatus = [
      "Present",
      "Absent",
      "Leave",
      "Half Day",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Attendance Status",
      });
    }

    // Find employee using ObjectId or Employee ID
    let employee;

    if (mongoose.Types.ObjectId.isValid(employeeId)) {
      employee = await Employee.findById(employeeId);
    }

    if (!employee) {
      employee = await Employee.findOne({
        employeeId: employeeId,
      });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee Not Found",
      });
    }

    // Check duplicate attendance for same employee and date
    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      attendanceDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        message:
          "Attendance already exists for this employee on this date",
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      employeeId: employee._id,
      attendanceDate,
      status,
      checkInTime: checkInTime || null,
      checkOutTime: checkOutTime || null,
      workedHours: workedHours || 0,
      notes: notes || "",
    });

    // Populate employee details
    const populatedAttendance =
      await Attendance.findById(attendance._id).populate(
        attendanceEmployeePopulate
      );

    return res.status(201).json({
      success: true,
      message: "Attendance Created Successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    console.error("Create Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get All Attendance
// ==========================================
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate(attendanceEmployeePopulate)
      .sort({
        attendanceDate: -1,
      });

    return res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error("Get Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const normalizeEmail = (email) => {
  if (!email || typeof email !== "string") return null;
  return email.trim().toLowerCase();
};

const getEmployeeIdentityCandidates = (employee) => {
  const candidates = new Set();

  if (employee?._id) {
    candidates.add(employee._id);
    if (typeof employee._id?.toString === "function") {
      candidates.add(employee._id.toString());
    }
  }

  if (employee?.employeeId) {
    candidates.add(employee.employeeId);
  }

  return Array.from(candidates).filter(Boolean);
};

const findEmployeeForCurrentUser = async (user, tokenEmployeeId) => {
  if (tokenEmployeeId) {
    if (mongoose.Types.ObjectId.isValid(tokenEmployeeId)) {
      const byId = await Employee.findById(tokenEmployeeId);
      if (byId) return byId;
    }

    const byCode = await Employee.findOne({ employeeId: tokenEmployeeId });
    if (byCode) return byCode;
  }

  const email = normalizeEmail(user?.email);
  if (email) {
    const byEmail = await Employee.findOne({ email });
    if (byEmail) return byEmail;
  }

  if (user?.id) {
    const profile = await Profile.findOne({ createdBy: user.id });
    if (profile?.employeeId) {
      const byProfile = await Employee.findOne({ employeeId: profile.employeeId });
      if (byProfile) return byProfile;
    }
  }

  return null;
};

// ==========================================
// Get Attendance for current authenticated employee
// ==========================================
const getMyAttendance = async (req, res) => {
  try {
    const tokenEmployeeId = req.user?.employeeId;
    const employee = await findEmployeeForCurrentUser(req.user, tokenEmployeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee Not Found",
      });
    }

    const employeeIdCandidates = [];

    if (employee?._id) {
      employeeIdCandidates.push(employee._id);
      if (typeof employee._id?.toString === "function") {
        employeeIdCandidates.push(employee._id.toString());
      }
    }

    const attendanceQuery = employeeIdCandidates.length
      ? {
          $or: employeeIdCandidates.map((candidate) => ({ employeeId: candidate })),
        }
      : { employeeId: employee._id };

    const attendance = await Attendance.find(attendanceQuery)
      .populate(attendanceEmployeePopulate)
      .sort({ attendanceDate: -1 });

    return res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error("Get My Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Attendance By ID
// ==========================================
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(
      req.params.id
    ).populate(attendanceEmployeePopulate);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("Get Attendance By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Update Attendance
// ==========================================
const updateAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      attendanceDate,
      status,
      checkInTime,
      checkOutTime,
      workedHours,
      notes,
    } = req.body;

    const attendance = await Attendance.findById(
      req.params.id
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance Not Found",
      });
    }

    // Validate status if provided
    if (
      status &&
      !["Present", "Absent", "Leave", "Half Day"].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Attendance Status",
      });
    }

    let resolvedEmployeeId = attendance.employeeId;

    // If employeeId is provided, find employee
    if (employeeId) {
      let employee;

      if (mongoose.Types.ObjectId.isValid(employeeId)) {
        employee = await Employee.findById(employeeId);
      }

      if (!employee) {
        employee = await Employee.findOne({
          employeeId: employeeId,
        });
      }

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee Not Found",
        });
      }

      resolvedEmployeeId = employee._id;
    }

    // Check duplicate attendance when employee/date changes
    if (employeeId || attendanceDate) {
      const dateToCheck =
        attendanceDate || attendance.attendanceDate;

      const startOfDay = new Date(dateToCheck);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dateToCheck);
      endOfDay.setHours(23, 59, 59, 999);

      const duplicate = await Attendance.findOne({
        employeeId: resolvedEmployeeId,
        attendanceDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        _id: {
          $ne: req.params.id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Attendance already exists for this employee on this date",
        });
      }
    }

    // Update
    attendance.employeeId = resolvedEmployeeId;

    if (attendanceDate !== undefined) {
      attendance.attendanceDate = attendanceDate;
    }

    if (status !== undefined) {
      attendance.status = status;
    }

    if (checkInTime !== undefined) {
      attendance.checkInTime = checkInTime;
    }

    if (checkOutTime !== undefined) {
      attendance.checkOutTime = checkOutTime;
    }

    if (workedHours !== undefined) {
      attendance.workedHours = workedHours;
    }

    if (notes !== undefined) {
      attendance.notes = notes;
    }

    await attendance.save();

    const updatedAttendance =
      await Attendance.findById(attendance._id).populate(
        attendanceEmployeePopulate
      );

    return res.status(200).json({
      success: true,
      message: "Attendance Updated Successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("Update Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Delete Attendance
// ==========================================
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(
      req.params.id
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance Not Found",
      });
    }

    await Attendance.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Attendance Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  getMyAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};