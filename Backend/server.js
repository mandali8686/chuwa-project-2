const express = require("express");
const cors = require("cors");
require("./mongoConnect");
require('dotenv').config();


const authRoutes = require("./routes/authRoutes");
const hrRoutes = require("./routes/hrRoutes");
const documentRoutes = require("./routes/documentRoutes");
const employeeRoute = require('./routes/Employees');

const app = express();
const port = 5400;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/documents", documentRoutes);
// app.use("/api/hr", hrRoutes);
app.use("/api/employees", employeeRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
