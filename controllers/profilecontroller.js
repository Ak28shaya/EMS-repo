const Profile = require("../models/Profile");

// ======================================
// Create Profile
// ======================================
const createProfile = async (req, res) => {
  try {
    const {
      employeeId,
      createdBy,
      firstName,
      lastName,
      email,
      phone,
      role,
      password,
      gender,
      dob,
      departmentId,
      designationId,
      salary,
      joiningDate,
      employmentType,
      status,
      address,
      profileImage,
    } = req.body;

    // Required Validation
    if (
      !employeeId ||
      !createdBy ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !role ||
      !password ||
      !gender ||
      !dob ||
      !departmentId ||
      !designationId ||
      !salary ||
      !joiningDate ||
      !employmentType ||
      !status ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check Employee ID
    const existingEmployee = await Profile.findOne({ employeeId });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists.",
      });
    }

    // Check Email
    const existingEmail = await Profile.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const profile = await Profile.create({
      employeeId,
      createdBy,
      firstName,
      lastName,
      email,
      phone,
      role,
      password,
      gender,
      dob,
      departmentId,
      designationId,
      salary,
      joiningDate,
      employmentType,
      status,
      address,
      profileImage,
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Get All Profiles
// ======================================
const getAllProfiles = async (req, res) => {
  try {

    const profiles = await Profile.find()
      .populate("departmentId")
      .populate("designationId")
      .populate("createdBy");

    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Get My Profile
// ======================================
const getMyProfile = async (req, res) => {
  try {
    const tokenUser = req.user || {};
    let profile = null;

    if (tokenUser.userId) {
      profile = await Profile.findOne({ createdBy: tokenUser.userId })
        .populate("departmentId")
        .populate("designationId")
        .populate("createdBy");
    }

    if (!profile && tokenUser.email) {
      profile = await Profile.findOne({ email: tokenUser.email })
        .populate("departmentId")
        .populate("designationId")
        .populate("createdBy");
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update My Profile
// ======================================
const updateMyProfile = async (req, res) => {
  try {
    const tokenUser = req.user || {};
    let query = {};

    if (tokenUser.userId) {
      query.createdBy = tokenUser.userId;
    }

    if (Object.keys(query).length === 0 && tokenUser.email) {
      query.email = tokenUser.email;
    }

    const profile = await Profile.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("departmentId")
      .populate("designationId")
      .populate("createdBy");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Profile By Employee ID
// ======================================
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
        success: false,
        message: "Profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Update Profile
// ======================================
const updateProfile = async (req, res) => {
  try {

    const profile = await Profile.findOneAndUpdate(
      {
        employeeId: req.params.employeeId,
      },
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
        success: false,
        message: "Profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Delete Profile
// ======================================
const deleteProfile = async (req, res) => {
  try {

    const profile = await Profile.findOneAndDelete({
      employeeId: req.params.employeeId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getMyProfile,
  getProfileByEmployeeId,
  updateMyProfile,
  updateProfile,
  deleteProfile,
};