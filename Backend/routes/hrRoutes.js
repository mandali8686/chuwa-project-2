const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const OnboardingToken = require("../models/OnboardingToken");
const Employee = require("../models/Employees");
const { verifyToken, requireHR } = require("../middlewares/verifyToken");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { createEmployee } = require('../controllers/Employees'); 

router.use(verifyToken, requireHR);

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
    // req.body.onboardingToken = token;  
    req.body = { email: email, username: email.split('@')[0], password:'12345' }; 
    await createEmployee(req, res);

    const resetLink = `http://localhost:5173/register/${token}`;
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // e.g., yourname@gmail.com
          pass: process.env.EMAIL_PWD  // your Gmail App Password or SMTP password
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
          <a href="${resetLink}">${resetLink}</a>
        `
      };
  
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Reset email sent successfully.' });

    // res.status(201).json({ token });
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
