const express = require("express");
const router = express.Router();

const {
  createProfile,
  getProfiles,
  getProfileByEmployeeId,
  updateProfile,
  deleteProfile,
} = require("../controllers/profilecontroller");

// Create Profile
router.post("/", createProfile);

// Get All Profiles
router.get("/", getProfiles);

// Get Profile By Employee ID
router.get("/:employeeId", getProfileByEmployeeId);

// Update Profile
router.put("/:employeeId", updateProfile);

// Delete Profile
router.delete("/:employeeId", deleteProfile);

module.exports = router;