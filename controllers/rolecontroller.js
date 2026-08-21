const Role = require("../models/role");
const User = require("../models/user");

const normalizeRoleName = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const normalizePermissions = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((permission) => permission !== undefined && permission !== null)
    .map((permission) => String(permission).trim())
    .filter(Boolean);
};

// ==============================
// Create Role
// ==============================
const createRole = async (req, res) => {
  try {
    const roleName = normalizeRoleName(req.body?.name);

    if (!roleName) {
      return res.status(400).json({
        message: "Role name is required",
      });
    }

    // Allow duplicate role names per user request. Create role directly.
    const role = await Role.create({
      name: roleName,
      permissions: normalizePermissions(req.body?.permissions),
    });

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
    const updatePayload = {};

    if (req.body?.name !== undefined) {
      const roleName = normalizeRoleName(req.body.name);
      if (!roleName) {
        return res.status(400).json({
          message: "Role name is required",
        });
      }
      updatePayload.name = roleName;
    }

    if (req.body?.permissions !== undefined) {
      updatePayload.permissions = normalizePermissions(req.body.permissions);
    }

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      updatePayload,
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
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        message: "Role Not Found",
      });
    }

    const assignedUsers = await User.countDocuments({ role: role._id });
    if (assignedUsers > 0) {
      return res.status(409).json({
        message: "Cannot delete a role that is assigned to users",
      });
    }

    await Role.findByIdAndDelete(req.params.id);

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