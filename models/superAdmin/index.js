const sequelize = require('../../config/database');
const { Sequelize } = require('sequelize');

const db = {
    sequelize,
    Sequelize
};

db.Category = require('./Category.js');
db.ChoreiMessage = require('./ChoreiMessage.js');
db.City = require('./City.js');
db.CorporatePricePolicy = require('./CorporatePricePolicy.js');
db.CurrencyMaster = require('./CurrencyMaster.js');
db.Dashboard = require('./Dashboard.js');
db.Department = require('./Department.js');
db.Designation = require('./Designation.js');
db.EmergencyResponseNetwork = require('./EmergencyResponseNetwork.js');
db.Employee = require('./Employee.js');
db.Event = require('./Event.js');
db.Floor = require('./Floor.js');
db.Group = require('./Group.js');
db.Holiday = require('./Holiday.js');
db.Location = require('./Location.js');
db.LoginDetail = require('./LoginDetail.js');
db.Message = require('./Message.js');
db.News = require('./News.js');
db.Notice = require('./Notice.js');
db.PhotoGallery = require('./PhotoGallery.js');
db.Policy = require('./Policy.js');
db.PopupImage = require('./PopupImage.js');
db.PriorityMaster = require('./PriorityMaster.js');
db.Product = require('./Product.js');
db.Region = require('./Region.js');
db.Role = require('./Role.js');
db.Room = require('./Room.js');
db.SalesPricePolicy = require('./SalesPricePolicy.js');
db.Tag = require('./Tag.js');
db.Ticket = require('./Ticket.js');
db.TicketAssignee = require('./TicketAssignee.js');
db.TicketFeedback = require('./TicketFeedback.js');
db.TicketFollower = require('./TicketFollower.js');
db.TicketReply = require('./TicketReply.js');
db.TodaysBirthdateAndAnniversary = require('./TodaysBirthdateAndAnniversary.js');
db.TypeMaster = require('./TypeMaster.js');
db.Unit = require('./Unit.js');
db.Zone = require('./Zone.js');

module.exports = db;
