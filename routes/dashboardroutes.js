const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getEmployeeDashboard,
} = require("../controllers/dashboardcontroller");

// Admin Dashboard
router.get("/admin", getAdminDashboard);

// Employee Dashboard
router.get("/employee/:employeeId", getEmployeeDashboard);

module.exports = router;