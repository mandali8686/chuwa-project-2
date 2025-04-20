const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employees');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Employee.findOne({ username });
  if (!user) return res.status(400).json({ msg: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1d' });
  res.json({ token, role: user.role.toLowerCase() });
});

module.exports = router;
