const mongoose = require("mongoose");
const Profile = require("../models/profile");
const Employee = require("../models/Employee");

const resolveEmployeeCode = async (employeeIdToken) => {
  if (!employeeIdToken) return null;

  if (mongoose.Types.ObjectId.isValid(employeeIdToken)) {
    const employee = await Employee.findById(employeeIdToken);
    if (employee?.employeeId) {
      return employee.employeeId;
    }
  }

  const employeeByCode = await Employee.findOne({ employeeId: employeeIdToken });
  if (employeeByCode?.employeeId) {
    return employeeByCode.employeeId;
  }

  return employeeIdToken?.toString();
};

const populateProfile = (query) =>
  query.populate("departmentId").populate("designationId").populate("createdBy");

const findProfileForCurrentUser = async (req) => {
  const employeeIdFromToken = req.user?.employeeId;
  if (employeeIdFromToken) {
    const resolvedEmployeeId = await resolveEmployeeCode(employeeIdFromToken);
    let profile = await populateProfile(Profile.findOne({ employeeId: resolvedEmployeeId }));
    if (profile) return profile;
    if (mongoose.Types.ObjectId.isValid(employeeIdFromToken)) {
      const employee = await Employee.findById(employeeIdFromToken);
      if (employee?.employeeId) {
        profile = await populateProfile(Profile.findOne({ employeeId: employee.employeeId }));
        if (profile) return profile;
      }
    }
  }

  return await populateProfile(Profile.findOne({ createdBy: req.user?.id }));
};

// ==============================
// Create Profile
// ==============================
const createProfile = async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };

    if (req.user && req.user.id) {
      payload.createdBy = req.user.id;
    }
    if (!payload.employeeId && req.user?.employeeId) {
      payload.employeeId = await resolveEmployeeCode(req.user.employeeId);
    }

    const profile = await Profile.create(payload);

    res.status(201).json({
      success: true,
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
// Get My Profile
// ==============================
const getMyProfile = async (req, res) => {
  try {
    let profile = await findProfileForCurrentUser(req);

    if (!profile) {
      return res.status(404).json({
        message: "Profile Not Found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update My Profile
// ==============================
const updateMyProfile = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      return res.status(400).json({
        message: "Employee ID is required to update profile",
      });
    }

    const profile = await findProfileForCurrentUser(req);
    if (!profile) {
      return res.status(404).json({
        message: "Profile Not Found",
      });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(profile._id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("departmentId")
      .populate("designationId")
      .populate("createdBy");

    if (!updatedProfile) {
      return res.status(404).json({
        message: "Profile Not Found",
      });
    }

    if (!profile) {
      return res.status(404).json({
        message: "Profile Not Found",
      });
    }

    res.status(200).json({
      success: true,
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
      success: true,
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
      success: true,
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
      success: true,
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
  getMyProfile,
  updateMyProfile,
  getProfiles,
  getProfileByEmployeeId,
  updateProfile,
  deleteProfile,
};