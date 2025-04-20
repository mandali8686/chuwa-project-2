const express = require("express");
const { connectDB } = require("./mongoConnect"); // ✅ 使用 connectDB
const authRoutes = require("./routes/authRoutes");
const hrRoutes = require("./routes/hrRoutes");
const app = express();
const port = 5400;

connectDB();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/hr", hrRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
