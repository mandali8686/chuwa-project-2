const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employees");
const OnboardingToken = require("../models/OnboardingToken");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Employee.findOne({ username });
  if (!user) return res.status(401).json({ msg: "User not found" });

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
  if (password !== user.password) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, "jwtSecret", {
    expiresIn: "1h",
  });
  res.json({ token:token, user:{role: user.role, userId:user._id} });
});

router.post("/register", async (req, res) => {
  const { username, email, password, token } = req.body;

  if (!username || !email || !password || !token) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const foundToken = await OnboardingToken.findOne({ token, email });

  if (!foundToken) {
    return res.status(400).json({ msg: "Invalid or mismatched token/email" });
  }

  if (foundToken.used) {
    return res.status(400).json({ msg: "Token has already been used" });
  }

  const existingUser = await Employee.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ msg: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new Employee({
    username,
    email,
    password: hashedPassword,
    role: "Employee",
  });

  await newUser.save();

  foundToken.used = true;
  await foundToken.save();

  const jwtToken = jwt.sign({ userId: newUser._id }, "jwtSecret", {
    expiresIn: "1h",
  });

  res.status(201).json({ msg: "Registration successful", token: jwtToken });
});

module.exports = router;
