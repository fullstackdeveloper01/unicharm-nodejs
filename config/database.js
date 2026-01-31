const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'EMS';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbDialect = process.env.DB_DIALECT || 'mysql';

console.log(`[DatabaseConfig] Initializing connection to ${dbDialect}://${dbHost}:${dbPort}/${dbName} as ${dbUser}`);

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect,
    dialectOptions: {
      connectTimeout: 60000, // Increased timeout
      // dateStrings: true, // Force date strings if needed
      // typeCast: true,
      timezone: '+00:00'
    },
    pool: {
      max: 10, // Increased max connections
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    // Enhanced logging function
    logging: (msg) => {
      if (process.env.DB_LOGGING === 'true') {
        console.log(`[Sequelize] ${msg}`);
      }
    },
    define: {
      timestamps: false, // Default unless overridden in model
      freezeTableName: true // Prevent Sequelize from pluralizing table names automatically (we set them manually)
    }
  }
);

module.exports = sequelize;
