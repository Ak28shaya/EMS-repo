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

    // Required Field Validations
    if (!employeeId) {
      return res.status(400).json({
        message: "Employee is required",
      });
    }

    if (!month) {
      return res.status(400).json({
        message: "Month is required",
      });
    }

    if (!year) {
      return res.status(400).json({
        message: "Year is required",
      });
    }

    if (!basicSalary) {
      return res.status(400).json({
        message: "Basic Salary is required",
      });
    }

    if (!paymentStatus) {
      return res.status(400).json({
        message: "Payment Status is required",
      });
    }

    // Check Duplicate Payroll
    const existingPayroll = await Payroll.findOne({
      employeeId,
      month,
      year,
    });

    if (existingPayroll) {
      return res.status(409).json({
        message:
          "Payroll already exists for this employee for the selected month and year",
      });
    }

    // Calculate Net Salary
    const netSalary =
      Number(basicSalary) +
      Number(allowance || 0) +
      Number(bonus || 0) -
      Number(deductions || 0) -
      Number(tax || 0);

    // Create Payroll
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
      "employeeId firstName lastName email"
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
      "employeeId firstName lastName email"
    );

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll Not Found",
      });
    }

    res.status(200).json({
      message: "Payroll Found",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Payroll
const updatePayroll = async (req, res) => {
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

    // Check Payroll Exists
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll Not Found",
      });
    }

    // Required Field Validations
    if (!employeeId) {
      return res.status(400).json({
        message: "Employee is required",
      });
    }

    if (!month) {
      return res.status(400).json({
        message: "Month is required",
      });
    }

    if (!year) {
      return res.status(400).json({
        message: "Year is required",
      });
    }

    if (!basicSalary) {
      return res.status(400).json({
        message: "Basic Salary is required",
      });
    }

    if (!paymentStatus) {
      return res.status(400).json({
        message: "Payment Status is required",
      });
    }

    // Check Duplicate Payroll
    const existingPayroll = await Payroll.findOne({
      employeeId,
      month,
      year,
      _id: { $ne: req.params.id },
    });

    if (existingPayroll) {
      return res.status(409).json({
        message:
          "Payroll already exists for this employee for the selected month and year",
      });
    }

    // Recalculate Net Salary
    const netSalary =
      Number(basicSalary) +
      Number(allowance || 0) +
      Number(bonus || 0) -
      Number(deductions || 0) -
      Number(tax || 0);

    // Update Payroll
    const updatedPayroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("employeeId", "employeeId firstName lastName email");

    res.status(200).json({
      message: "Payroll Updated Successfully",
      payroll: updatedPayroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Payroll
const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll Not Found",
      });
    }

    await Payroll.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Payroll Deleted Successfully",
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
  updatePayroll,
  deletePayroll,
};