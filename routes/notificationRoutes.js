const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markNotificationsRead,
} = require("../controllers/notificationcontroller");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, getMyNotifications);
router.put("/mark-read", authMiddleware, markNotificationsRead);

module.exports = router;
