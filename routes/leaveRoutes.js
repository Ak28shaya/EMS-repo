const express = require("express");

const router = express.Router();

const {
  applyLeave,
  getAllLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");


// Employee Apply Leave
router.post("/", applyLeave);


// Admin View All Leaves
router.get("/", getAllLeaves);


// Employee View Own Leaves
router.get("/:employeeId", getEmployeeLeaves);


// Admin Approve / Reject
router.put("/:id", updateLeaveStatus);

module.exports = router;