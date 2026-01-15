const sequelize = require('../config/database');
const Department = require('./Department');
const Designation = require('./Designation');
const Role = require('./Role');
const Employee = require('./Employee');
const Unit = require('./Unit');
const Zone = require('./Zone');
const Location = require('./Location');
const Floor = require('./Floor');
const Room = require('./Room');
const City = require('./City');
const Ticket = require('./Ticket');
const TicketReply = require('./TicketReply');
const Message = require('./Message');
const Notice = require('./Notice');
const Policy = require('./Policy');
const Event = require('./Event');
const Holiday = require('./Holiday');
const News = require('./News');
const QuoteOfTheDay = require('./QuoteOfTheDay');
const Group = require('./Group');
const MeetingNotification = require('./MeetingNotification');
const Accountant = require('./Accountant');
const Auditor = require('./Auditor');
const ExpenseLocation = require('./ExpenseLocation');
const CustomImage = require('./CustomImage');
const CompanyImage = require('./CompanyImage');
const PhotoGallery = require('./PhotoGallery');
const Product = require('./Product');
const Tag = require('./Tag');
const Wall = require('./Wall');
const TypeMaster = require('./TypeMaster');
const PriorityMaster = require('./PriorityMaster');
const CurrencyMaster = require('./CurrencyMaster');
const ChoreiMessage = require('./ChoreiMessage');

// Define associations
Department.hasMany(Employee, { foreignKey: 'DepartmentId', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'DepartmentId', as: 'department' });

Department.hasMany(Designation, { foreignKey: 'DepartmentId', as: 'designations' });
Designation.belongsTo(Department, { foreignKey: 'DepartmentId', as: 'department' });

Designation.hasMany(Employee, { foreignKey: 'DesignationId', as: 'employees' });
Employee.belongsTo(Designation, { foreignKey: 'DesignationId', as: 'designation' });

Role.hasMany(Employee, { foreignKey: 'RoleId', as: 'employees' });
Employee.belongsTo(Role, { foreignKey: 'RoleId', as: 'role' });

Unit.hasMany(Zone, { foreignKey: 'UnitId', as: 'zones' });
Zone.belongsTo(Unit, { foreignKey: 'UnitId', as: 'unit' });

Unit.hasMany(ExpenseLocation, { foreignKey: 'UnitId', as: 'expenseLocations' });
ExpenseLocation.belongsTo(Unit, { foreignKey: 'UnitId', as: 'unit' });

Unit.hasMany(Employee, { foreignKey: 'Unit', as: 'employees' });
Employee.belongsTo(Unit, { foreignKey: 'Unit', as: 'unit' });

Zone.hasMany(Employee, { foreignKey: 'Zone', as: 'employees' });
Employee.belongsTo(Zone, { foreignKey: 'Zone', as: 'zone' });

Location.hasMany(Employee, { foreignKey: 'Location', as: 'employees' });
Employee.belongsTo(Location, { foreignKey: 'Location', as: 'location' });

Location.hasMany(Floor, { foreignKey: 'LocationId', as: 'floors' });
Floor.belongsTo(Location, { foreignKey: 'LocationId', as: 'location' });

Floor.hasMany(Room, { foreignKey: 'FloorId', as: 'rooms' });
Room.belongsTo(Floor, { foreignKey: 'FloorId', as: 'floor' });

Employee.hasMany(Ticket, { foreignKey: 'EmployeeId', as: 'tickets' });
Ticket.belongsTo(Employee, { foreignKey: 'EmployeeId', as: 'employee' });

Ticket.hasMany(TicketReply, { foreignKey: 'TicketId', as: 'replies' });
TicketReply.belongsTo(Ticket, { foreignKey: 'TicketId', as: 'ticket' });

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Department,
  Designation,
  Role,
  Employee,
  Unit,
  Zone,
  Location,
  Floor,
  Room,
  City,
  Ticket,
  TicketReply,
  Message,
  Notice,
  Policy,
  Event,
  Holiday,
  News,
  QuoteOfTheDay,
  Group,
  MeetingNotification,
  Accountant,
  Auditor,
  ExpenseLocation,
  CustomImage,
  CompanyImage,
  PhotoGallery,
  Product,
  Tag,
  Wall,
  TypeMaster,
  PriorityMaster,
  CurrencyMaster,
  ChoreiMessage
};

module.exports = db;
