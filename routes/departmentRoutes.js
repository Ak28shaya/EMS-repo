const express = require("express");
const router = express.Router();

const {
    createDepartment,
    getDepartments,
    getDepartmentById
} = require("../controllers/departmentcontroller");

router.post("/", createDepartment);

router.get("/", getDepartments);

router.get("/:id", getDepartmentById);

module.exports = router;