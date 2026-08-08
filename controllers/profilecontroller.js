const Profile = require("../models/Profile");

// ==============================
// Create Profile
// ==============================
const createProfile = async (req, res) => {
  try {
    const profile = await Profile.create(req.body);

    res.status(201).json({
      message: "Profile Created Successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get All Profiles
// ==============================
const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("departmentId")
      .populate("designationId")
      .populate("createdBy")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Profile List",
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get Profile By Employee ID
// ==============================
const getProfileByEmployeeId = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      employeeId: req.params.employeeId,
    })
      .populate("departmentId")
      .populate("designationId")
      .populate("createdBy");

    if (!profile) {
      return res.status(404).json({
        message: "Profile Not Found",
      });
    }

    res.status(200).json({
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Profile
// ==============================
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("departmentId")
      .populate("designationId")
      .populate("createdBy");

    if (!profile) {
      return res.status(404).json({
        message: "Profile Not Found",
      });
    }

    res.status(200).json({
      message: "Profile Updated Successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Delete Profile
// ==============================
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({
      employeeId: req.params.employeeId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile Not Found",
      });
    }

    res.status(200).json({
      message: "Profile Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfiles,
  getProfileByEmployeeId,
  updateProfile,
  deleteProfile,
};