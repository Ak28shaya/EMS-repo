const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  createPayroll,
  getPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
} = require("../controllers/payrollcontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("payroll");

router.post("/", authMiddleware, roleMiddleware(...allowed), createPayroll);

router.get("/", authMiddleware, roleMiddleware(...allowed), getPayrolls);

router.get("/:id", authMiddleware, roleMiddleware(...allowed), getPayrollById);

router.put("/:id", authMiddleware, roleMiddleware(...allowed), updatePayroll);

router.delete("/:id", authMiddleware, roleMiddleware(...allowed), deletePayroll);

module.exports = router;