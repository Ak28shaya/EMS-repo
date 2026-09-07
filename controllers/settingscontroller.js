const Settings = require("../models/settings");

// Create Settings
const createSettings = async (req, res) => {
  try {
    const settings = await Settings.create(req.body);

    res.status(201).json({
      message: "Company Settings Created Successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Settings
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({
        message: "Settings Not Found",
      });
    }

    res.status(200).json({
      settings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Settings
const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!settings) {
      return res.status(404).json({
        message: "Settings Not Found",
      });
    }

    res.status(200).json({
      message: "Settings Updated Successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSettings,
  getSettings,
  updateSettings,
};