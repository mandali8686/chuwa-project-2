const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const employeeRoutes = require('./routes/Employees');
const documentRoutes = require('./routes/Documents');
const contactRoutes = require('./routes/Contact');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/employees', employeeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/contacts', contactRoutes);



const port = 5400;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });