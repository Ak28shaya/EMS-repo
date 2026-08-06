const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  createProfile,
  getAllProfiles,
  getMyProfile,
  getProfileByEmployeeId,
  updateMyProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("profile");

// Create Profile
router.post("/", authMiddleware, roleMiddleware(...allowed), createProfile);

// Get All Profiles
router.get("/", authMiddleware, roleMiddleware(...allowed), getAllProfiles);

// Get current authenticated user's profile
router.get("/me", authMiddleware, roleMiddleware(...allowed), getMyProfile);

// Get Profile By Employee ID
router.get("/:employeeId", authMiddleware, roleMiddleware(...allowed), getProfileByEmployeeId);

// Update current authenticated user's profile
router.put("/me", authMiddleware, roleMiddleware(...allowed), updateMyProfile);

// Update Profile
router.put("/:employeeId", authMiddleware, roleMiddleware(...allowed), updateProfile);

// Delete Profile
router.delete("/:employeeId", authMiddleware, roleMiddleware(...allowed), deleteProfile);

module.exports = router;