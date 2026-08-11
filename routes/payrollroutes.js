const express = require("express");
const router = express.Router();

const {
  createPayroll,
  getPayrolls,
  getMyPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
} = require("../controllers/payrollcontroller");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createPayroll);
router.get("/", authMiddleware, getPayrolls);
router.get("/me", authMiddleware, getMyPayrolls);
router.get("/:id", authMiddleware, getPayrollById);
router.put("/:id", authMiddleware, updatePayroll);
router.delete("/:id", authMiddleware, deletePayroll);

module.exports = router;