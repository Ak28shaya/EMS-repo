const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
const authController = require("./controllers/authController");
const app = express();
// Convert JSON data from requests
app.use(express.json());
// Connect to MongoDB
connectDB();
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use("/auth", authRoutes);
// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});