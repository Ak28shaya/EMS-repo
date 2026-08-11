const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAdminDashboard,
  getEmployeeDashboard,
} = require("../controllers/dashboardcontroller");

// Admin Dashboard
router.get("/admin", authMiddleware, getAdminDashboard);

// Public Admin Dashboard (no auth) - useful for local development / demo
router.get("/admin/public", getAdminDashboard);

// Employee Dashboard
router.get("/employee/me", authMiddleware, getEmployeeDashboard);
router.get("/employee/:employeeId", authMiddleware, getEmployeeDashboard);

module.exports = router;