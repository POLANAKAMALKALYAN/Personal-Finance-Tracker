const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const connectDB = require('../config/db');

app.use('/api/auth', require('../routes/auth'));
app.use('/api/transactions', require('../routes/transactions'));
app.use('/api/categories', require('../routes/categories'));
app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;