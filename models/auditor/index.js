const sequelize = require('../../config/database');
const { Sequelize } = require('sequelize');

const db = {
    sequelize,
    Sequelize
};

db.Auditor = require('./Auditor.js');

module.exports = db;
