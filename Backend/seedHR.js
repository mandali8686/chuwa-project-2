require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./mongoConnect");
const Employee = require("./models/Employees");
const bcrypt = require("bcryptjs");

const seedHR = async () => {
    await connectDB();
    const hashed = await bcrypt.hash("123456", 10);
    await Employee.create({
        username: "hradmin",
        email: "hr@example.com",
        password: hashed,
        role: "HR"
    });
    console.log("✅ HR user created successfully");
    process.exit();
};

seedHR();
