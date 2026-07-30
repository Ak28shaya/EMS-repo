const Employee = require("../models/Employee");

// Create Employee
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
            salary,
            employmentType,
            status,
            createdBy
        } = req.body;

        // Required Field Validations
        if (!employeeId) {
            return res.status(400).json({
                message: "Employee ID is required"
            });
        }

        if (!firstName) {
            return res.status(400).json({
                message: "First Name is required"
            });
        }

        if (!lastName) {
            return res.status(400).json({
                message: "Last Name is required"
            });
        }

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        if (!phone) {
            return res.status(400).json({
                message: "Phone Number is required"
            });
        }

        if (!gender) {
            return res.status(400).json({
                message: "Gender is required"
            });
        }

        if (!dob) {
            return res.status(400).json({
                message: "Date of Birth is required"
            });
        }

        if (!address) {
            return res.status(400).json({
                message: "Address is required"
            });
        }

        if (!joiningDate) {
            return res.status(400).json({
                message: "Joining Date is required"
            });
        }

        if (!departmentId) {
            return res.status(400).json({
                message: "Department is required"
            });
        }

        if (!salary) {
            return res.status(400).json({
                message: "Salary is required"
            });
        }

        if (!employmentType) {
            return res.status(400).json({
                message: "Employment Type is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        if (!createdBy) {
            return res.status(400).json({
                message: "Created By is required"
            });
        }

        // Check Duplicate Employee ID
        const existingEmployeeId = await Employee.findOne({ employeeId });

        if (existingEmployeeId) {
            return res.status(409).json({
                message: "Employee ID already exists"
            });
        }

        // Check Duplicate Email
        const existingEmail = await Employee.findOne({ email });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Create Employee
        const employee = await Employee.create(req.body);

        res.status(201).json({
            message: "Employee Created Successfully",
            employee
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate("departmentId")
            .populate("designationId")
            .populate("createdBy");

        res.status(200).json({
            message: "Employee List",
            count: employees.length,
            employees
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Employee By ID
const getEmployeeById = async (req, res) => {
    try {

        const employee = await Employee.findById(req.params.id)
            .populate("departmentId")
            .populate("designationId")
            .populate("createdBy");

        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }

        res.status(200).json({
            message: "Employee Found",
            employee
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Employee
const updateEmployee = async (req, res) => {
    try {

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Employee Updated Successfully",
            employee: updatedEmployee
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
    try {

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }

        await Employee.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Employee Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};//employee controller