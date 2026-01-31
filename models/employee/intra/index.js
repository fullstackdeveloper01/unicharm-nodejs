const sequelize = require('../../../config/database');
const { Sequelize } = require('sequelize');

const db = {
    sequelize,
    Sequelize
};

db.CompanyImage = require('./CompanyImage.js');
db.CustomImage = require('./CustomImage.js');
db.MeetingNotification = require('./MeetingNotification.js');
db.MeetingRequest = require('./MeetingRequest.js');
db.QuoteOfTheDay = require('./QuoteOfTheDay.js');
db.Wall = require('./Wall.js');
db.WallComment = require('./WallComment.js');
db.WallLike = require('./WallLike.js');

module.exports = db;
