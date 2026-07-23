const Role = require("../models/role");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(409).json({ message: "Role already exists" });
    }

    const role = new Role({ name, permissions });
    await role.save();

    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};