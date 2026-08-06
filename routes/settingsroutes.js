const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  createSettings,
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("settings");

// Create Company Settings
router.post("/", authMiddleware, roleMiddleware(...allowed), createSettings);

// Get Company Settings
router.get("/", authMiddleware, roleMiddleware(...allowed), getSettings);

// Update Company Settings
router.put("/:id", authMiddleware, roleMiddleware(...allowed), updateSettings);

module.exports = router;