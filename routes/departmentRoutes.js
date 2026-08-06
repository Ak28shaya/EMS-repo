const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getEmployeesByDepartment,
} = require("../controllers/departmentcontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("department");

router.post("/", authMiddleware, roleMiddleware(...allowed), createDepartment);

router.get("/", authMiddleware, roleMiddleware(...allowed), getDepartments);

router.get("/:id", authMiddleware, roleMiddleware(...allowed), getDepartmentById);

router.put("/:id", authMiddleware, roleMiddleware(...allowed), updateDepartment);

router.delete("/:id", authMiddleware, roleMiddleware(...allowed), deleteDepartment);

router.get("/department/:departmentId", authMiddleware, roleMiddleware(...allowed), getEmployeesByDepartment);

module.exports = router;