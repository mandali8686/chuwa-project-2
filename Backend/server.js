const express = require("express");
const cors = require("cors");
require("./mongoConnect");

const authRoutes = require("./routes/authRoutes");
const hrRoutes = require("./routes/hrRoutes");
const documentRoutes = require("./routes/documentRoutes");

const app = express();
const port = 5400;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/documents", documentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
