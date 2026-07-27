const Payroll = require("../models/payroll");

// Create Payroll
const createPayroll = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      basicSalary,
      allowance,
      bonus,
      deductions,
      tax,
      paymentStatus,
      paymentDate,
    } = req.body;

    // Calculate Net Salary
    const netSalary =
      Number(basicSalary) +
      Number(allowance) +
      Number(bonus) -
      Number(deductions) -
      Number(tax);

    // Save Payroll
    const payroll = await Payroll.create({
      employeeId,
      month,
      year,
      basicSalary,
      allowance,
      bonus,
      deductions,
      tax,
      netSalary,
      paymentStatus,
      paymentDate,
    });

    res.status(201).json({
      message: "Payroll Created Successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Payrolls
const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate(
      "employeeId",
      "employeeName email"
    );

    res.status(200).json({
      message: "Payroll List",
      count: payrolls.length,
      payrolls,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Payroll By ID
const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate(
      "employeeId",
      "employeeName email"
    );

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll Not Found",
      });
    }

    res.status(200).json({
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPayroll,
  getPayrolls,
  getPayrollById,
};