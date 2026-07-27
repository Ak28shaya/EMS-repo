const express = require("express");

const router = express.Router();

const {
  createPayroll,
  getPayrolls,
  getPayrollById,
} = require("../controllers/payrollcontroller");

router.post("/", createPayroll);

router.get("/", getPayrolls);

router.get("/:id", getPayrollById);

module.exports = router;