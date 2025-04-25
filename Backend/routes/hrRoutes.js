// routes/hr.js
const express = require("express");
const router = express.Router();
const { verifyToken, requireHR } = require("../middlewares/verifyToken");
const {
  getAllEmployees,
  createOnboardingTokenAndSendEmail,
  updateEmployeeOnboardingStatus
} = require("../controllers/HR");

router.use(verifyToken, requireHR);

router.get("/employees", getAllEmployees);

router.post("/token", createOnboardingTokenAndSendEmail);

router.patch("/employees/:id", updateEmployeeOnboardingStatus);

module.exports = router;
