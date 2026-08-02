const express = require("express");

const router = express.Router();

const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployeesByDepartment
} = require("../controllers/employeecontroller");

router.post("/", createDepartment);

router.get("/", getDepartments);

router.get("/:id", getDepartmentById);

router.put("/:id", updateDepartment);

router.delete("/:id", deleteDepartment);

router.get("/department/:departmentId", getEmployeesByDepartment);

module.exports = router;