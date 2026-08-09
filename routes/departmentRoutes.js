const express = require("express");
const router = express.Router();

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentEmployees,
} = require("../controllers/departmentController");

router.post("/", createDepartment);

router.get("/", getDepartments);

// Get employees for a specific department
router.get("/department/:departmentId", getDepartmentEmployees);

router.get("/:id", getDepartmentById);

router.put("/:id", updateDepartment);

router.delete("/:id", deleteDepartment);

module.exports = router;