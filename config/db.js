const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://sathya_db_user:Sathya12345@ac-vegkojf-shard-00-00.geospr9.mongodb.net:27017,ac-vegkojf-shard-00-01.geospr9.mongodb.net:27017,ac-vegkojf-shard-00-02.geospr9.mongodb.net:27017/?ssl=true&replicaSet=atlas-18kfn7-shard-0&authSource=admin&appName=SkyWingsCluster");
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("Database Connection Failed");
    }
};
module.exports = connectDB;