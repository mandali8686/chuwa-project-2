const mongoose = require("../mongoConnect").mongoose;

const onboardingTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OnboardingToken", onboardingTokenSchema);
