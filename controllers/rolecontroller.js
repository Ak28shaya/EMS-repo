const Role = require("../models/Role");

// ==============================
// Create Role
// ==============================
const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);

    res.status(201).json({
      message: "Role Created Successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get All Roles
// ==============================
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Role List",
      count: roles.length,
      roles,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get Role By ID
// ==============================
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        message: "Role Not Found",
      });
    }

    res.status(200).json({
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Role
// ==============================
const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!role) {
      return res.status(404).json({
        message: "Role Not Found",
      });
    }

    res.status(200).json({
      message: "Role Updated Successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Delete Role
// ==============================
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).json({
        message: "Role Not Found",
      });
    }

    res.status(200).json({
      message: "Role Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};