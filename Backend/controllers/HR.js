const { v4: uuidv4 } = require("uuid");
const OnboardingToken = require("../models/OnboardingToken");
const Employee = require("../models/Employees");
const nodemailer = require('nodemailer');
const { createEmployee } = require('./Employees');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, "-password");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};


exports.createOnboardingTokenAndSendEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    const token = uuidv4();
    const newToken = new OnboardingToken({ email, token });
    await newToken.save();

    const newEmployee = await createEmployee({
      email,
      username: email.split('@')[0],
      password: '12345'
    });

    const resetLink = `http://localhost:5173/register/${token}`;

    console.log('Going to mailer', process.env.EMAIL_USER, process.env.EMAIL_PWD);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
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
    console.log('Sent');

    res.status(201).json({
      message: 'Onboarding token created and reset email sent successfully.',
      token,
      employeeId: newEmployee._id
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


exports.updateEmployeeOnboardingStatus = async (req, res) => {
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
};
