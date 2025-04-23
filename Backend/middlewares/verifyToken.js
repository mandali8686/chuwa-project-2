const jwt = require("jsonwebtoken");
const Employee = require("../models/Employees");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "jwtSecret");

    const user = await Employee.findById(decoded.userId);
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

const requireHR = (req, res, next) => {
  if (req.user.role !== "HR") {
    return res.status(403).json({ msg: "Access denied: HR only" });
  }
  next();
};

module.exports = {
  verifyToken,
  requireHR,
};
