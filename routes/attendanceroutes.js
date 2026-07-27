const express = require("express");

const router = express.Router();

const {
  createAttendance,
  getAttendance,
} = require("../controllers/attendancecontroller");

router.post("/", createAttendance);

router.get("/", getAttendance);

module.exports = router;