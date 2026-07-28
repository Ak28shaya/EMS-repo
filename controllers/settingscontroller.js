const Settings = require("../models/Settings");

// Create Company Settings
const createSettings = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyWebsite,
      companyLogo,
    } = req.body;

    // Validation
    if (
      !companyName ||
      !companyEmail ||
      !companyPhone ||
      !companyAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Company Name, Email, Phone and Address are required.",
      });
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(companyEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company email.",
      });
    }

    // Phone Validation
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(companyPhone)) {
      return res.status(400).json({
        success: false,
        message: "Company phone number must contain exactly 10 digits.",
      });
    }

    // Check if settings already exist
    const existingSettings = await Settings.findOne();

    if (existingSettings) {
      return res.status(400).json({
        success: false,
        message: "Company settings already exist.",
      });
    }

    // Create Settings
    const settings = await Settings.create({
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyWebsite,
      companyLogo,
    });

    res.status(201).json({
      success: true,
      message: "Company settings created successfully.",
      settings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get Company Settings
const getSettings = async (req, res) => {
  try {

    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Company settings not found.",
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Update Company Settings
const updateSettings = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyWebsite,
      companyLogo,
    } = req.body;

    // Validation
    if (
      !companyName ||
      !companyEmail ||
      !companyPhone ||
      !companyAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Company Name, Email, Phone and Address are required.",
      });
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(companyEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company email.",
      });
    }

    // Phone Validation
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(companyPhone)) {
      return res.status(400).json({
        success: false,
        message: "Company phone number must contain exactly 10 digits.",
      });
    }

    const settings = await Settings.findByIdAndUpdate(
      id,
      {
        companyName,
        companyEmail,
        companyPhone,
        companyAddress,
        companyWebsite,
        companyLogo,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Company settings not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company settings updated successfully.",
      settings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



module.exports = {
  createSettings,
  getSettings,
  updateSettings,
};