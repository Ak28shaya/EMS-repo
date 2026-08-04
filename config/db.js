const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ems";
        if (!process.env.MONGO_URI) {
            console.warn("MONGO_URI not set — falling back to default mongodb://127.0.0.1:27017/ems");
        }
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log("==================================");
        console.log("MongoDB Connected Successfully");
        console.log("Database:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);
        console.log("==================================");

    } catch (error) {
        console.error("MongoDB Connection Failed");
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = connectDB;