const Employee = require("../models/employee");
const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({
            message: "Employee Created Successfully",
            employee
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate("departmentId")
            .populate("designationId")
            .populate("createdBy");
        res.status(200).json({
            count: employees.length,
            employees
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate("departmentId")
            .populate("designationId")
            .populate("createdBy");
        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );
        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }
        res.status(200).json({
            message: "Employee Updated Successfully",
            employee
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }
        res.status(200).json({
            message: "Employee Deleted Successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};