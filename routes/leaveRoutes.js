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

// Protected leave routes
router.post("/", authMiddleware, createLeave);
router.get("/", authMiddleware, getLeaves);
router.get("/me", authMiddleware, getMyLeaves);
router.get("/:id", authMiddleware, getLeaveById);
router.put("/:id", authMiddleware, updateLeave);
router.delete("/:id", authMiddleware, deleteLeave);

module.exports = router;