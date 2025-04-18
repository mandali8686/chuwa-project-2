const express = require('express');

const app = express();
const port = 5400;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });