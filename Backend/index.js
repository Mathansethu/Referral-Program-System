const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoutes);  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

