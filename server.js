require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const designationRoutes = require("./routes/designationroutes");
const payrollRoutes = require("./routes/payrollRoutes");
const attendanceRoutes = require("./routes/attendanceroutes"); // Add here
const noticeRoutes = require("./routes/noticeroutes");
const settingsRoutes = require("./routes/settingsroutes");
const dashboardRoutes = require("./routes/dashboardroutes");

const app = express();

app.use(express.json());

connectDB();

// Logger Middleware
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/departments", departmentRoutes);
app.use("/employees", employeeRoutes);
app.use("/designations", designationRoutes);
app.use("/payrolls", payrollRoutes);
app.use("/attendance", attendanceRoutes); // Add here
app.use("/notices", noticeRoutes);
app.use("/settings", settingsRoutes);
app.use("/dashboard", dashboardRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send("EMS Backend Running");
});

// Start Server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});