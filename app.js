const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const partyRoutes = require('./routes/partyRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
// Enable CORS for all routes
app.use(cors());
app.use(express.json());  // Parse incoming JSON requests

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/users', userRoutes);

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
