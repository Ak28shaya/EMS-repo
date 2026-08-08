const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAdminDashboard,
  getEmployeeDashboard,
} = require("../controllers/dashboardController");

// Admin Dashboard
router.get("/admin", authMiddleware, getAdminDashboard);

// Employee Dashboard
router.get("/employee/:employeeId", authMiddleware, getEmployeeDashboard);

module.exports = router;