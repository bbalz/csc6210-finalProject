const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const equipmentRoutes = require('./routes/equipment');
const maintenanceRecordRoutes = require('./routes/maintenanceRecords');

// Use routes
app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRecordRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Equipment Maintenance API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});