const express = require("express");

const router = express.Router();

const {
  createProfile,
  getAllProfiles,
  getProfileByEmployeeId,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

// Create Profile
router.post("/", createProfile);

// Get All Profiles
router.get("/", getAllProfiles);

// Get Profile By Employee ID
router.get("/:employeeId", getProfileByEmployeeId);

// Update Profile
router.put("/:employeeId", updateProfile);

// Delete Profile
router.delete("/:employeeId", deleteProfile);

module.exports = router;