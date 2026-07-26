const Department = require("../models/department");

// Create Department
const createDepartment = async (req, res) => {
    try {
        const { departmentName, description, managerId } = req.body;
        if (!departmentName) {
            return res.status(400).json({
                message: "Department Name is required"
            });
        }
        const existingDepartment = await Department.findOne({
            departmentName
        });
        if (existingDepartment) {
            return res.status(409).json({
                message: "Department already exists"
            });
        }
        const department = await Department.create({
            departmentName,
            description,
            managerId
        });
        res.status(201).json({
            message: "Department Created Successfully",
            department
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// Get All Departments
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({
            count: departments.length,
            departments
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// Get Department By ID
const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({
                message: "Department Not Found"
            });
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById
};