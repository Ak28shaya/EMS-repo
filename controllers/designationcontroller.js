const Designation = require("../models/designation");

// ==========================
// Create Designation
// ==========================
const createDesignation = async (req, res) => {
  try {
    const { designationName, departmentId } = req.body;

    if (!designationName) {
      return res.status(400).json({
        message: "Designation Name is required",
      });
    }

    if (!departmentId) {
      return res.status(400).json({
        message: "Department is required",
      });
    }

    const existingDesignation = await Designation.findOne({
      designationName,
      departmentId,
    });

    if (existingDesignation) {
      return res.status(409).json({
        message: "Designation already exists in this department",
      });
    }

    const designation = await Designation.create({
      designationName,
      departmentId,
    });

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

// ==========================
// Get All Designations
// ==========================
const getDesignations = async (req, res) => {
  try {
    const designations = await Designation.find()
      .populate("departmentId", "departmentName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Designation List",
      count: designations.length,
      designations,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Get Designation By ID
// ==========================
const getDesignationById = async (req, res) => {
  try {
    const designation = await Designation.findById(req.params.id)
      .populate("departmentId", "departmentName");

    if (!designation) {
      return res.status(404).json({
        message: "Designation Not Found",
      });
    }

    res.status(200).json({
      designation,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Update Designation
// ==========================
const updateDesignation = async (req, res) => {
  try {
    const { designationName, departmentId } = req.body;

    const designation = await Designation.findById(req.params.id);

    if (!designation) {
      return res.status(404).json({
        message: "Designation Not Found",
      });
    }

    if (!designationName) {
      return res.status(400).json({
        message: "Designation Name is required",
      });
    }

    if (!departmentId) {
      return res.status(400).json({
        message: "Department is required",
      });
    }

    const existingDesignation = await Designation.findOne({
      designationName,
      departmentId,
      _id: { $ne: req.params.id },
    });

    if (existingDesignation) {
      return res.status(409).json({
        message: "Designation already exists in this department",
      });
    }

    const updatedDesignation = await Designation.findByIdAndUpdate(
      req.params.id,
      {
        designationName,
        departmentId,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("departmentId", "departmentName");

    res.status(200).json({
      message: "Designation Updated Successfully",
      designation: updatedDesignation,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Delete Designation
// ==========================
const deleteDesignation = async (req, res) => {
  try {
    const designation = await Designation.findById(req.params.id);

    if (!designation) {
      return res.status(404).json({
        message: "Designation Not Found",
      });
    }

    await Designation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Designation Deleted Successfully",
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
  getDesignationById,
  updateDesignation,
  deleteDesignation,
};