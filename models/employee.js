const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
{
    employeeId: {
        type: String,
        required: true,
        unique: true
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },

    dob: {
        type: Date
    },

    address: {
        type: String
    },

    joiningDate: {
        type: Date,
        default: Date.now
    },

    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },

    designationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designation",
        default: null
    },

    reportingManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null
    },

    salary: {
        type: Number
    },

    profileImage: {
        type: String
    },

    employmentType: {
        type: String,
        enum: ["Permanent", "Contract", "Intern"]
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Employee", employeeSchema, "employees");