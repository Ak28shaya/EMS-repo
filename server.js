const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const designationRoutes = require("./routes/designationroutes");
const attendanceRoutes = require("./routes/attendanceroutes"); // Add here
const noticeRoutes = require("./routes/noticeroutes");

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
app.use("/attendance", attendanceRoutes); // Add here
app.use("/notices", noticeRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send("EMS Backend Running");
});

// Start Server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});