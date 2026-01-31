const sequelize = require('../../config/database');
const { Sequelize } = require('sequelize');

const db = {
    sequelize,
    Sequelize
};

db.Accountant = require('./Accountant.js');

module.exports = db;
