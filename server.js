const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes"); // ✅ adjust filename to match yours exactly
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(express.json());

connectDB();

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);  
app.use("/departments", departmentRoutes);
app.use("/employees", employeeRoutes);

app.get("/", (req, res) => {
    res.send("EMS Backend Running");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});