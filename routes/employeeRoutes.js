const express = require("express");
const router = express.Router();

const {
    createEmployee,
    getEmployees,
    getEmployeeById
} = require("../controllers/employeecontroller");

router.post("/", createEmployee);

router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

module.exports = router;