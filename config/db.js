const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/EMS");
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("Database Connection Failed");
    }
};
module.exports = connectDB;