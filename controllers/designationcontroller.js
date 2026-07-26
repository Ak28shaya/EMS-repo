const Designation = require("../models/designation");

// Create Designation
const createDesignation = async (req, res) => {
  try {
    const designation = await Designation.create(req.body);

    res.status(201).json({
      message: "Designation Created Successfully",
      designation,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Designations
const getDesignations = async (req, res) => {
  try {
    const designations = await Designation.find().populate(
      "departmentId",
      "departmentName"
    );

    res.status(200).json({
      message: "All Designations",
      count: designations.length,
      designations,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createDesignation,
  getDesignations,
};