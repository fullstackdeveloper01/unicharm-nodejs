const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');

// Load Models from all portals to ensure they are registered with Sequelize
require('./models/superAdmin');
require('./models/employee/intra');
require('./models/employee/expense');
require('./models/accountant');
require('./models/auditor');

const routes = require('./routes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Sync database and start server
const startServer = async () => {
  try {
    console.log('[System] Connecting to Database...');
    await sequelize.authenticate();
    console.log('[System] Database connection established successfully.');
    console.log(`[System] Connected to Database: ${sequelize.config.database} on ${sequelize.config.host}`);

    console.log('[System] Syncing Models...');
    console.log('----------------------------------------------------');

    // Log registered models
    const models = Object.keys(sequelize.models);
    console.log(`[System] Found ${models.length} Models registered:`);
    models.forEach(m => {
      const tableName = sequelize.models[m].tableName;
      console.log(` - Model: ${m.padEnd(30)} -> Table: ${tableName}`);
    });
    console.log('----------------------------------------------------');

    // Sync database (create tables if they don't exist, alter if changed)
    // User requested: "tables should be created from our code itself" and "if having then dont do if nit then do"
    // alter: true safely updates columns. force: false prevents dropping.
    await sequelize.sync({ alter: true });
    console.log('[System] Database Sync Complete. All tables are up to date.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log('====================================================');
      console.log(`[Server] Server is running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Server] API Base URL: http://localhost:${PORT}/api`);
      console.log('====================================================');
    });

  } catch (err) {
    console.error('====================================================');
    console.error('[System] FATAL ERROR: Unable to start server');
    console.error(err);
    console.error('====================================================');
    process.exit(1);
  }
};

startServer();

module.exports = app;
