const Profile = require("../models/Profile");
const Employee = require("../models/Employee");

const resolveProfileForUser = async (req) => {
  const tokenEmployeeId = req.user?.employeeId;
  const userId = req.user?.id;
  const email = req.user?.email?.toLowerCase?.();

  if (tokenEmployeeId) {
    let profile = await Profile.findOne({ employeeId: tokenEmployeeId });
    if (profile) return profile;

    if (require("mongoose").Types.ObjectId.isValid(tokenEmployeeId)) {
      const employee = await Employee.findById(tokenEmployeeId);
      if (employee?.employeeId) {
        profile = await Profile.findOne({ employeeId: employee.employeeId });
        if (profile) return profile;
      }
    }
  }

  if (email) {
    const profile = await Profile.findOne({ email });
    if (profile) return profile;
  }

  if (userId) {
    const profile = await Profile.findOne({ createdBy: userId });
    if (profile) return profile;
  }

  return null;
};

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
// Get Current User Profile
// ==============================
const getMyProfile = async (req, res) => {
  try {
    const profile = await resolveProfileForUser(req);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for current user",
      });
    }

    await profile
      .populate("departmentId")
      .populate("designationId")
      .populate("createdBy");

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Current User Profile
// ==============================
const updateMyProfile = async (req, res) => {
  try {
    const profile = await resolveProfileForUser(req);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for current user",
      });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("departmentId")
      .populate("designationId")
      .populate("createdBy");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
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
  getMyProfile,
  updateProfile,
  updateMyProfile,
  deleteProfile,
};