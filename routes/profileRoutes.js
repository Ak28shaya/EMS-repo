const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createProfile,
  getProfiles,
  getProfileByEmployeeId,
  getMyProfile,
  updateProfile,
  updateMyProfile,
  deleteProfile,
} = require("../controllers/profilecontroller");

// Create Profile
router.post("/", authMiddleware, createProfile);

// Get All Profiles
router.get("/", authMiddleware, getProfiles);

// Get Current User Profile
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

// Get Profile By Employee ID
router.get("/:employeeId", authMiddleware, getProfileByEmployeeId);

// Update Profile
router.put("/:employeeId", authMiddleware, updateProfile);

// Delete Profile
router.delete("/:employeeId", authMiddleware, deleteProfile);

module.exports = router;