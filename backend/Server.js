require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const port = process.env.PORT || 5000;

// Database connection test
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    
    // Sync all models
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('All models synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/campaigns', require('./routes/campaignRoutes'));

// Simple GET endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'SMS Campaign Management API' });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});