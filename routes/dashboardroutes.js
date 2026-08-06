const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  getAdminDashboard,
  getEmployeeDashboard,
  getCurrentEmployeeDashboard,
} = require("../controllers/dashboardcontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("dashboard");

// Admin Dashboard
router.get("/admin", authMiddleware, roleMiddleware(...allowed), getAdminDashboard);

// Current authenticated employee dashboard
// NOTE: this must be registered BEFORE "/employee/:employeeId" below.
// Express matches routes in registration order, and ":employeeId" is a
// wildcard that would otherwise swallow the literal path "/employee/me"
// (matching it with employeeId === "me"), so getCurrentEmployeeDashboard
// would never actually run.
router.get("/employee/me", authMiddleware, roleMiddleware("employee", "manager", "hr", "admin"), getCurrentEmployeeDashboard);

// Employee Dashboard by employeeId
router.get("/employee/:employeeId", authMiddleware, roleMiddleware(...allowed), getEmployeeDashboard);

module.exports = router;