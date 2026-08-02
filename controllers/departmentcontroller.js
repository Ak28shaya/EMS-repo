const Department = require("../models/Department");
const Employee = require("../models/Employee");


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
    const departments = await Department.find().sort({
      createdAt: -1,
    });

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

    await Department.findByIdAndDelete(req.params.id);

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
    updateDepartment,
    deleteDepartment,
    getEmployeesByDepartment
};