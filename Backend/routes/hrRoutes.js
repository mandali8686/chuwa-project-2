const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const OnboardingToken = require("../models/OnboardingToken");
const Employee = require("../models/Employees");

router.get("/employees", async (req, res) => {
  const employees = await Employee.find({}, "-password");
  res.json(employees);
});

//  POST /api/hr/token
router.post("/token", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    const token = uuidv4();
    const newToken = new OnboardingToken({ email, token });
    await newToken.save();

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

router.patch("/employees/:id", async (req, res) => {
  const { status, feedback } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { onboarding: { status, feedback } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;
