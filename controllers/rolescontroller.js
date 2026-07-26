const Role = require("../models/role");
const ROLE_PERMISSIONS = require("../config/rolepermissions");
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Role name is required"
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
                message: "Invalid role name"
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
module.exports = {
    getAllRoles,
    createRole
};