const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const roleRoutes = require("./routes/roleroutes");
const authRoutes = require("./routes/authroutes");

app.use("/roles", roleRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("EMS Backend Running");
});

mongoose.connect("mongodb://localhost:27017/EMS")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});