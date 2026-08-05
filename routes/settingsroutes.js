const express = require("express");
const router = express.Router();

const {
  createSettings,
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

// Create Company Settings
router.post("/", createSettings);

// Get Company Settings
router.get("/", getSettings);

// Update Company Settings
router.put("/:id", updateSettings);

module.exports = router;