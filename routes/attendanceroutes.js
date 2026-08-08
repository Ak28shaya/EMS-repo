const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  createAttendance,
  getAttendance,
  getMyAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendancecontroller");

const allowed =
  ROLE_PERMISSIONS.getAllowedRoleVariants("attendance");

// ==========================================
// CREATE
// POST /attendance
// ==========================================
router.post(
  "/",
  authMiddleware,
  roleMiddleware(...allowed),
  createAttendance
);

// ==========================================
// GET ALL
// GET /attendance
// ==========================================
router.get(
  "/",
  authMiddleware,
  roleMiddleware(...allowed),
  getAttendance
);

// ==========================================
// GET CURRENT EMPLOYEE
// GET /attendance/me
// ==========================================
router.get(
  "/me",
  authMiddleware,
  roleMiddleware(...allowed),
  getMyAttendance
);

// ==========================================
// GET BY ID
// GET /attendance/:id
// ==========================================
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(...allowed),
  getAttendanceById
);

// ==========================================
// UPDATE
// PUT /attendance/:id
// ==========================================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(...allowed),
  updateAttendance
);

// ==========================================
// DELETE
// DELETE /attendance/:id
// ==========================================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(...allowed),
  deleteAttendance
);

module.exports = router;