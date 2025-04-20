const express = require("express");
const router = express.Router();
const OnboardingToken = require("../models/OnboardingToken");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// 中间件：验证 HR 身份
const hrAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, "jwtSecret"); // 你可以改成 process.env.JWT_SECRET
    req.user = decoded;

    // 简单地假设 HR 用户 role 是 hardcoded 的，后期可替换成 DB 校验
    // 你可以从 DB 中根据 decoded.id 查询用户角色
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};

// ✅ 创建 token
router.post("/token", hrAuth, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    const token = uuidv4(); // 生成唯一 token
    const newToken = new OnboardingToken({ email, token });
    await newToken.save();
    res.status(201).json({ msg: "Token created", token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// ✅ 获取历史 token
router.get("/token-history", hrAuth, async (req, res) => {
  try {
    const tokens = await OnboardingToken.find().sort({ createdAt: -1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tokens", err });
  }
});

module.exports = router;
