const Payroll = require("../models/payroll");

// ==============================
// Create Payroll
// ==============================
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

    const netSalary =
      Number(basicSalary || 0) +
      Number(allowance || 0) +
      Number(bonus || 0) -
      Number(deductions || 0) -
      Number(tax || 0);

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

// ==============================
// Get All Payrolls
// ==============================
const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate({
        path: "employeeId",
        populate: [
          { path: "departmentId" },
          { path: "designationId" }
        ]
      })
      .sort({ createdAt: -1 });

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

// ==============================
// Get Current Employee Payrolls
// ==============================
const getMyPayrolls = async (req, res) => {
  try {
    const tokenEmployeeId = req.user?.employeeId;
    if (!tokenEmployeeId) {
      return res.status(400).json({
        message: "Employee identifier missing in token.",
      });
    }

    const payrolls = await Payroll.find({ employeeId: tokenEmployeeId })
      .populate({
        path: "employeeId",
        populate: [
          { path: "departmentId" },
          { path: "designationId" }
        ]
      })
      .sort({ createdAt: -1 });

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

// ==============================
// Get Payroll By ID
// ==============================
const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate("employeeId");

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

// ==============================
// Update Payroll
// ==============================
const updatePayroll = async (req, res) => {
  try {
    const {
      basicSalary,
      allowance,
      bonus,
      deductions,
      tax,
    } = req.body;

    if (basicSalary !== undefined) {
      req.body.netSalary =
        Number(basicSalary || 0) +
        Number(allowance || 0) +
        Number(bonus || 0) -
        Number(deductions || 0) -
        Number(tax || 0);
    }

    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("employeeId");

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll Not Found",
      });
    }

    res.status(200).json({
      message: "Payroll Updated Successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Delete Payroll
// ==============================
const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll Not Found",
      });
    }

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
  getMyPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
};