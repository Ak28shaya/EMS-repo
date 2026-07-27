const Role = require("../models/role");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

// Get All Roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();

        res.status(200).json({
            message: "Role List",
            count: roles.length,
            roles
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Role By ID
const getRoleById = async (req, res) => {
    try {

        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                message: "Role Not Found"
            });
        }

        res.status(200).json({
            message: "Role Found",
            role
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Create Role
const createRole = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Role Name is required"
            });
        }

        const existingRole = await Role.findOne({
            name: name.toLowerCase()
        });

        if (existingRole) {
            return res.status(409).json({
                message: "Role already exists"
            });
        }

        const permissions = ROLE_PERMISSIONS[name.toLowerCase()];

        if (!permissions) {
            return res.status(400).json({
                message: "Invalid Role Name"
            });
        }

        const role = await Role.create({
            name: name.toLowerCase(),
            permissions
        });

        res.status(201).json({
            message: "Role Created Successfully",
            role
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Role
const updateRole = async (req, res) => {
    try {

        const { name } = req.body;

        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                message: "Role Not Found"
            });
        }

        if (!name) {
            return res.status(400).json({
                message: "Role Name is required"
            });
        }

        const existingRole = await Role.findOne({
            name: name.toLowerCase(),
            _id: { $ne: req.params.id }
        });

        if (existingRole) {
            return res.status(409).json({
                message: "Role already exists"
            });
        }

        const permissions = ROLE_PERMISSIONS[name.toLowerCase()];

        if (!permissions) {
            return res.status(400).json({
                message: "Invalid Role Name"
            });
        }

        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            {
                name: name.toLowerCase(),
                permissions
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Role Updated Successfully",
            role: updatedRole
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Role
const deleteRole = async (req, res) => {
    try {

        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                message: "Role Not Found"
            });
        }

        await Role.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Role Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};