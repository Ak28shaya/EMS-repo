const Employee = require("../models/employee");

// ==========================
// Create Employee
// ==========================
const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      address,
      joiningDate,
      departmentId,
      designationId,
      salary,
      employmentType,
      status,
      createdBy,
    } = req.body;

    if (!employeeId)
      return res.status(400).json({ message: "Employee ID is required" });

    if (!firstName)
      return res.status(400).json({ message: "First Name is required" });

    if (!lastName)
      return res.status(400).json({ message: "Last Name is required" });

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    if (!phone)
      return res.status(400).json({ message: "Phone Number is required" });

    if (!gender)
      return res.status(400).json({ message: "Gender is required" });

    if (!dob)
      return res.status(400).json({ message: "Date of Birth is required" });

    if (!address)
      return res.status(400).json({ message: "Address is required" });

    if (!joiningDate)
      return res.status(400).json({ message: "Joining Date is required" });

    if (!departmentId)
      return res.status(400).json({ message: "Department is required" });

    if (!designationId)
      return res.status(400).json({ message: "Designation is required" });

    if (!salary)
      return res.status(400).json({ message: "Salary is required" });

    if (!employmentType)
      return res.status(400).json({ message: "Employment Type is required" });

    if (!status)
      return res.status(400).json({ message: "Status is required" });

    if (!createdBy)
      return res.status(400).json({ message: "Created By is required" });

    // Check only active employees
    const existingEmployee = await Employee.findOne({
      employeeId,
      isDeleted: false,
    });

    if (existingEmployee) {
      return res.status(409).json({
        message: "Employee ID already exists",
      });
    }

    // Check only active employees
    const existingEmail = await Employee.findOne({
      email,
      isDeleted: false,
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const employee = await Employee.create(req.body);

    res.status(201).json({
      message: "Employee Created Successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Get All Active Employees
// ==========================
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      isDeleted: false,
    })
      .populate("departmentId", "departmentName")
      .populate("designationId", "designationName")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Employee List",
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Get Employee By ID
// ==========================
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("departmentId", "departmentName")
      .populate("designationId", "designationName")
      .populate("createdBy", "name email");

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    res.status(200).json({
      message: "Employee Found",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Update Employee
// ==========================
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    // Prevent duplicate Employee ID
    if (req.body.employeeId) {
      const existingEmployee = await Employee.findOne({
        employeeId: req.body.employeeId,
        _id: { $ne: req.params.id },
        isDeleted: false,
      });

      if (existingEmployee) {
        return res.status(409).json({
          message: "Employee ID already exists",
        });
      }
    }

    // Prevent duplicate Email
    if (req.body.email) {
      const existingEmail = await Employee.findOne({
        email: req.body.email,
        _id: { $ne: req.params.id },
        isDeleted: false,
      });

      if (existingEmail) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("departmentId", "departmentName")
      .populate("designationId", "designationName")
      .populate("createdBy", "name email");

    res.status(200).json({
      message: "Employee Updated Successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Soft Delete Employee
// ==========================
const deleteEmployee = async (req, res) => {
  console.log("🔥 SOFT DELETE EMPLOYEE CALLED");

  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    // Soft delete instead of permanently deleting
    await Employee.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.status(200).json({
      message: "Employee Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Employee Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};