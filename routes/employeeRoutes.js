const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeecontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("employee");

router.post("/", authMiddleware, roleMiddleware(...allowed), createEmployee);

router.get("/", authMiddleware, roleMiddleware(...allowed), getEmployees);

router.get("/:id", authMiddleware, roleMiddleware(...allowed), getEmployeeById);

router.put("/:id", authMiddleware, roleMiddleware(...allowed), updateEmployee);

router.delete("/:id", authMiddleware, roleMiddleware(...allowed), deleteEmployee);

module.exports = router;