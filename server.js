require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const employeeDashboardRoutes = require("./routes/employeedashboardRoutes");
const authRoutes = require("./routes/authroutes");
const roleRoutes = require("./routes/roleroutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const designationRoutes = require("./routes/designationroutes");
const payrollRoutes = require("./routes/payrollroutes");
const attendanceRoutes = require("./routes/attendanceroutes");
const noticeRoutes = require("./routes/noticeroutes");
const settingsRoutes = require("./routes/settingsroutes");
const dashboardRoutes = require("./routes/dashboardroutes");
const leaveRoutes = require("./routes/leaveRoutes");
const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Connect Database
connectDB();

// Middlewares
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/departments", departmentRoutes);
app.use("/employees", employeeRoutes);
app.use("/designations", designationRoutes);
app.use("/payrolls", payrollRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/notices", noticeRoutes);
app.use("/settings", settingsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/profile", profileRoutes);
app.use("/leave", leaveRoutes);
app.use("/leaves", leaveRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/employeedashboard", employeeDashboardRoutes);
app.use("/api/employeedashboard", employeeDashboardRoutes);
app.use("/notifications", notificationRoutes);
app.use("/api/notifications", notificationRoutes);

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "EMS Backend Running Successfully"
    });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("=================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log("=================================");
});