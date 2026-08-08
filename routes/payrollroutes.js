const express = require("express");
const router = express.Router();

const {
  createPayroll,
  getPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
} = require("../controllers/payrollcontroller");

router.post("/", createPayroll);
router.get("/", getPayrolls);
router.get("/:id", getPayrollById);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

module.exports = router;