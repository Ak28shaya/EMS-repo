const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  createAttendance,
  getAttendance,
  getAttendanceSummary,
  getMyAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendancecontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("attendance");

router.post("/", authMiddleware, roleMiddleware(...allowed), createAttendance);

router.get("/summary", authMiddleware, roleMiddleware(...allowed), getAttendanceSummary);

router.get("/", authMiddleware, roleMiddleware(...allowed), getAttendance);

// Employee: get current user's attendance
router.get("/me", authMiddleware, getMyAttendance);

router.put("/:id", authMiddleware, roleMiddleware(...allowed), updateAttendance);

router.delete("/:id", authMiddleware, roleMiddleware(...allowed), deleteAttendance);

module.exports = router;