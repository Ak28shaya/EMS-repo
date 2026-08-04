/*
  Migration script: fix attendance.employeeId fields that store employee code strings
  instead of ObjectId references. For each attendance record where employeeId is a string
  and not a valid ObjectId, the script will attempt to find the matching Employee by
  their `employeeId` code and replace the attendance.employeeId with the Employee._id.

  Usage:
    node scripts/fixAttendanceEmployeeIds.js

  Ensure MONGO_URI is set in environment or use a .env file loaded by your environment.
*/

const connectDB = require("../config/db");
const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const Employee = require("../models/employee");

(async () => {
  try {
    await connectDB();

    console.log("Scanning attendance records for non-ObjectId employee references...");

    const all = await Attendance.find();
    let updated = 0;
    for (const rec of all) {
      const eid = rec.employeeId;
      const isObjectId = mongoose.Types.ObjectId.isValid(eid);
      if (!isObjectId) {
        // attempt to find employee by employeeId code
        const emp = await Employee.findOne({ employeeId: eid });
        if (emp) {
          rec.employeeId = emp._id;
          await rec.save();
          updated++;
          console.log(`Updated attendance ${rec._id} -> employee ${emp._id}`);
        } else {
          console.warn(`No employee found for attendance ${rec._id} with employeeId value '${eid}'`);
        }
      }
    }

    console.log(`Done. Updated ${updated} records.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
