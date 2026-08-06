const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  getEmployeeDashboard,
  getCurrentEmployeeDashboard,
} = require("../controllers/employeedashboardcontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("dashboard");

// ===============================
// Employee Dashboard
// ===============================

// Get current authenticated employee dashboard
router.get("/me", authMiddleware, roleMiddleware(...allowed), getCurrentEmployeeDashboard);

// Get complete employee dashboard by employeeId
router.get("/:employeeId", authMiddleware, roleMiddleware(...allowed), getEmployeeDashboard);

module.exports = router;