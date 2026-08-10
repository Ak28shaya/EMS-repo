const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  getMyLeaves,
} = require("../controllers/leaveController");

// Public create/list routes (admins or internal callers may protect these elsewhere)
router.post("/", createLeave);
router.get("/", getLeaves);

// Current user leaves (protected)
router.get("/me", authMiddleware, getMyLeaves);

router.get("/:id", getLeaveById);
router.put("/:id", updateLeave);
router.delete("/:id", deleteLeave);

module.exports = router;