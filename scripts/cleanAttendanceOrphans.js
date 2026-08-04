/*
  Cleanup script to remove attendance records that:
  - reference a non-existent Employee
  - have invalid status (not in allowed list)
  - have invalid attendanceDate

  Usage:
    node scripts/cleanAttendanceOrphans.js
*/

const connectDB = require("../config/db");
const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const Employee = require("../models/employee");

(async () => {
  try {
    await connectDB();

    console.log("Scanning attendance records for orphans and invalid entries...");

    const all = await Attendance.find();
    let removed = 0;
    for (const rec of all) {
      let bad = false;

      // Check employeeId validity
      const eid = rec.employeeId;
      const isObjectId = mongoose.Types.ObjectId.isValid(eid);
      let employeeExists = false;
      if (isObjectId) {
        const emp = await Employee.findById(eid);
        employeeExists = !!emp;
      } else {
        // Maybe legacy code string
        const emp = await Employee.findOne({ employeeId: eid });
        employeeExists = !!emp;
      }
      if (!employeeExists) {
        console.warn(`Orphan attendance record ${rec._id} -> employee '${eid}' not found`);
        bad = true;
      }

      // Check attendanceDate validity
      if (!rec.attendanceDate || isNaN(new Date(rec.attendanceDate).getTime())) {
        console.warn(`Invalid attendanceDate for record ${rec._id}`);
        bad = true;
      }

      // Check status validity
      const validStatus = ["Present", "Absent", "Leave", "Half Day"];
      if (!validStatus.includes(rec.status)) {
        console.warn(`Invalid status '${rec.status}' for record ${rec._id}`);
        bad = true;
      }

      if (bad) {
        await Attendance.findByIdAndDelete(rec._id);
        removed++;
        console.log(`Deleted ${rec._id}`);
      }
    }

    console.log(`Done. Removed ${removed} attendance records.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
