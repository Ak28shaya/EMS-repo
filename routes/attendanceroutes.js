const express = require("express");

const router = express.Router();

const {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendancecontroller");

router.post("/", createAttendance);

router.get("/", getAttendance);

router.put("/:id", updateAttendance);

router.delete("/:id", deleteAttendance);

module.exports = router;