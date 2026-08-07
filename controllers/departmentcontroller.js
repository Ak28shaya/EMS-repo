const Department = require("../models/Department");
const Employee = require("../models/Employee");
const Designation = require("../models/Designation");
const Attendance = require("../models/Attendance");
const Payroll = require("../models/Payroll");
const Profile = require("../models/profile");
const User = require("../models/User");


// Create Department
const createDepartment = async (req, res) => {
  try {
    const {
      departmentName,
      description,
      headName,
      headDesignation,
      employeeCount,
    } = req.body;

    if (
      !departmentName ||
      !description ||
      !headName ||
      !headDesignation
    ) {
      return res.status(400).json({
        message:
          "Department Name, Description, Head Name and Head Designation are required",
      });
    }

    const existingDepartment = await Department.findOne({
      departmentName,
    });

    if (existingDepartment) {
      return res.status(409).json({
        message: "Department already exists",
      });
    }

    const department = await Department.create({
      departmentName,
      description,
      headName,
      headDesignation,
      employeeCount,
    });

    res.status(201).json({
      message: "Department Created Successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "departmentId",
          as: "employees",
        },
      },
      {
        $addFields: {
          employeeCount: { $size: "$employees" },
        },
      },
      {
        $project: {
          employees: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    res.status(200).json({
      count: departments.length,
      departments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Department By ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department Not Found",
      });
    }

    res.status(200).json({
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Get Employees By Department
const getEmployeesByDepartment = async (req, res) => {
    try {
        const employees = await Employee.find({
            departmentId: req.params.departmentId
        }).populate("departmentId", "departmentName");

        res.status(200).json({
            count: employees.length,
            employees
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Department
const updateDepartment = async (req, res) => {
  try {
    const {
      departmentName,
      description,
      headName,
      headDesignation,
      employeeCount,
    } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department Not Found",
      });
    }

    const existingDepartment = await Department.findOne({
      departmentName,
      _id: { $ne: req.params.id },
    });

    if (existingDepartment) {
      return res.status(409).json({
        message: "Department already exists",
      });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      {
        departmentName,
        description,
        headName,
        headDesignation,
        employeeCount,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Department Updated Successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Department
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department Not Found",
      });
    }

    const employees = await Employee.find({ departmentId: department._id });
    const employeeIds = employees.map((employee) => employee._id);
    const employeeCodeIds = employees.map((employee) => employee.employeeId).filter(Boolean);

    await Promise.all([
      Attendance.deleteMany({ employeeId: { $in: employeeIds } }),
      Payroll.deleteMany({ employeeId: { $in: employeeIds } }),
      Profile.deleteMany({ employeeId: { $in: employeeCodeIds } }),
      User.deleteMany({ email: { $in: employees.map((e) => e.email).filter(Boolean) } }),
      Employee.deleteMany({ departmentId: department._id }),
      Designation.deleteMany({ departmentId: department._id }),
      Department.findByIdAndDelete(req.params.id),
    ]);

    res.status(200).json({
      message: "Department Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  getEmployeesByDepartment,
  updateDepartment,
  deleteDepartment,
};