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
      isDeleted: false,
      deletedAt: null,
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
// Get All Active Payrolls
// ==============================
const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find({
      isDeleted: false,
    })
      .populate({
        path: "employeeId",
        populate: [
          { path: "departmentId" },
          { path: "designationId" },
        ],
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

    const payrolls = await Payroll.find({
      employeeId: tokenEmployeeId,
      isDeleted: false,
    })
      .populate({
        path: "employeeId",
        populate: [
          { path: "departmentId" },
          { path: "designationId" },
        ],
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
    const payroll = await Payroll.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate({
      path: "employeeId",
      populate: [
        { path: "departmentId" },
        { path: "designationId" },
      ],
    });

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

    // Find only active payroll
    const existingPayroll = await Payroll.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!existingPayroll) {
      return res.status(404).json({
        message: "Payroll Not Found",
      });
    }

    // Recalculate net salary
    const finalBasicSalary =
      basicSalary !== undefined
        ? Number(basicSalary || 0)
        : Number(existingPayroll.basicSalary || 0);

    const finalAllowance =
      allowance !== undefined
        ? Number(allowance || 0)
        : Number(existingPayroll.allowance || 0);

    const finalBonus =
      bonus !== undefined
        ? Number(bonus || 0)
        : Number(existingPayroll.bonus || 0);

    const finalDeductions =
      deductions !== undefined
        ? Number(deductions || 0)
        : Number(existingPayroll.deductions || 0);

    const finalTax =
      tax !== undefined
        ? Number(tax || 0)
        : Number(existingPayroll.tax || 0);

    req.body.netSalary =
      finalBasicSalary +
      finalAllowance +
      finalBonus -
      finalDeductions -
      finalTax;

    const payroll = await Payroll.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "employeeId",
      populate: [
        { path: "departmentId" },
        { path: "designationId" },
      ],
    });

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
// Soft Delete Payroll
// ==============================
const deletePayroll = async (req, res) => {
  try {
    console.log("🔥 SOFT DELETE PAYROLL CALLED");

    const payroll = await Payroll.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll Not Found",
      });
    }

    await Payroll.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.status(200).json({
      message: "Payroll Deleted Successfully",
    });
  } catch (error) {
    console.error("Soft Delete Payroll Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Export Controllers
// ==============================
module.exports = {
  createPayroll,
  getPayrolls,
  getMyPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
};