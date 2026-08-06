const Attendance = require("../models/attendance");
const Employee = require("../models/employee");
const Profile = require("../models/profile");
const mongoose = require("mongoose");

const formatAttendanceRecord = (item) => ({
  _id: item._id,
  employeeCode: item.employeeId?.employeeId || "N/A",
  employeeName: item.employeeId
    ? `${item.employeeId.firstName || ""} ${item.employeeId.lastName || ""}`.trim()
    : "Unknown",
  departmentName: item.employeeId?.departmentId?.name || "Unknown",
  attendanceDate: item.attendanceDate,
  status: item.status,
  checkInTime: item.checkInTime || null,
  checkOutTime: item.checkOutTime || null,
  workedHours: item.workedHours ?? 0,
  notes: item.notes || "",
  createdAt: item.createdAt,
});

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

    if (!employeeId) {
      return res.status(400).json({ message: "Employee is required" });
    }

    // Support both ObjectId (_id) and legacy employeeId code strings.
    let resolvedEmployeeId = employeeId;
    const mongoose = require("mongoose");
    const isObjectId = mongoose.Types.ObjectId.isValid(employeeId);
    if (!isObjectId) {
      // Try to find employee by their employeeId code (e.g. "EMP-1001")
      const found = await Employee.findOne({ employeeId: employeeId });
      if (!found) {
        return res.status(404).json({ message: "Employee not found" });
      }
      resolvedEmployeeId = found._id;
    }

    const employeeExists = await Employee.findById(resolvedEmployeeId);
    if (!employeeExists) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!attendanceDate) {
      return res.status(400).json({ message: "Attendance Date is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Attendance Status is required" });
    }

    const validStatus = ["Present", "Absent", "Leave", "Half Day"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid Attendance Status. Status must be Present, Absent, Leave, or Half Day.",
      });
    }

    // Normalize attendanceDate to UTC midnight for consistent storage and duplicate checks
    const dateObj = new Date(attendanceDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: "Invalid attendanceDate" });
    }
    const startOfDay = new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()));
    const nextDay = new Date(startOfDay);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    // Prevent duplicate attendance entries for same employee + date.
    // If a record already exists for the same employee and date, update it instead of failing.
    const duplicate = await Attendance.findOne({
      employeeId: resolvedEmployeeId,
      attendanceDate: { $gte: startOfDay, $lt: nextDay },
    });

    let attendance;
    if (duplicate) {
      const payload = {
        status,
        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
        workedHours: workedHours ?? 0,
        notes: notes || "",
      };

      attendance = await Attendance.findByIdAndUpdate(duplicate._id, payload, {
        new: true,
        runValidators: true,
      });
    } else {
      attendance = await Attendance.create({
        employeeId: resolvedEmployeeId,
        attendanceDate: startOfDay,
        status,
        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
        workedHours: workedHours ?? 0,
        notes: notes || "",
      });
    }

    res.status(201).json({
      message: "Attendance Marked Successfully",
      attendance: formatAttendanceRecord(await attendance.populate({ path: "employeeId", populate: { path: "departmentId", select: "name" } })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .sort({ attendanceDate: -1 })
      .populate({
        path: "employeeId",
        select: "employeeId firstName lastName departmentId",
        populate: { path: "departmentId", select: "name" },
      });

    const result = attendance.map(formatAttendanceRecord);

    res.status(200).json({
      message: "Attendance List",
      count: result.length,
      attendance: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .sort({ attendanceDate: 1 })
      .populate({
        path: "employeeId",
        select: "employeeId firstName lastName departmentId",
        populate: { path: "departmentId", select: "name" },
      });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyStats = [];
    const departmentStats = [];
    const monthlyMap = new Map();
    const departmentMap = new Map();

    attendance.forEach((item) => {
      const date = new Date(item.attendanceDate);
      const monthName = monthNames[date.getMonth()];
      const entry = monthlyMap.get(monthName) || { name: monthName, Present: 0, Absent: 0, Leave: 0, "Half Day": 0 };
      entry[item.status] = (entry[item.status] || 0) + 1;
      monthlyMap.set(monthName, entry);

      const departmentName = item.employeeId?.departmentId?.name || "Unknown";
      const departmentEntry = departmentMap.get(departmentName) || { name: departmentName, Present: 0, Absent: 0, Leave: 0, "Half Day": 0 };
      departmentEntry[item.status] = (departmentEntry[item.status] || 0) + 1;
      departmentMap.set(departmentName, departmentEntry);
    });

    monthlyMap.forEach((value) => monthlyStats.push(value));
    departmentMap.forEach((value) => departmentStats.push(value));

    res.status(200).json({
      message: "Attendance Summary",
      monthlyStats,
      departmentStats,
      totalRecords: attendance.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { employeeId, attendanceDate, status, checkInTime, checkOutTime, workedHours, notes } = req.body;

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance Record Not Found" });
    }

    if (employeeId) {
      const employeeExists = await Employee.findById(employeeId);
      if (!employeeExists) {
        return res.status(404).json({ message: "Employee not found" });
      }
    }

    const payload = {
      ...(employeeId ? { employeeId } : {}),
      ...(attendanceDate ? { attendanceDate } : {}),
      ...(status ? { status } : {}),
      ...(checkInTime !== undefined ? { checkInTime } : {}),
      ...(checkOutTime !== undefined ? { checkOutTime } : {}),
      ...(workedHours !== undefined ? { workedHours } : {}),
      ...(notes !== undefined ? { notes } : {}),
    };

    const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Attendance Updated Successfully",
      attendance: formatAttendanceRecord(await updatedAttendance.populate({ path: "employeeId", populate: { path: "departmentId", select: "name" } })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance Record Not Found" });
    }

    await Attendance.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Attendance Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const tokenUser = req.user || {};

    // Try multiple strategies to locate the employee record for the current user:
    // 1) token may contain an employeeId
    // 2) there may be a Profile linked to this user (Profile.createdBy === userId) containing employeeId
    // 3) fallback to matching employee by email in token
    let employee = null;

    if (tokenUser.employeeId) {
      employee = await Employee.findById(tokenUser.employeeId);
    }

    if (!employee && tokenUser.userId) {
      const profile = await Profile.findOne({ createdBy: tokenUser.userId });
      if (profile && profile.employeeId) {
        employee = await Employee.findOne({ employeeId: profile.employeeId });
      }
    }

    if (!employee && tokenUser.email) {
      employee = await Employee.findOne({ email: tokenUser.email });
    }

    if (!employee) {
      return res.status(404).json({ message: "Employee record not found for current user" });
    }

    const attendance = await Attendance.find({ employeeId: employee._id })
      .sort({ attendanceDate: -1 })
      .populate({
        path: "employeeId",
        select: "employeeId firstName lastName departmentId",
        populate: { path: "departmentId", select: "name" },
      });

    const result = attendance.map(formatAttendanceRecord);

    res.status(200).json({ message: "My Attendance", count: result.length, attendance: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  getAttendanceSummary,
  getMyAttendance,
  updateAttendance,
  deleteAttendance,
};