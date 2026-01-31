const sequelize = require('../../../config/database');
const { Sequelize } = require('sequelize');

const db = {
    sequelize,
    Sequelize
};

db.ExpenseLocation = require('./ExpenseLocation.js');

module.exports = db;
