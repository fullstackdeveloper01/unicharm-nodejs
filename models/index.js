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
const PopupImage = require('./PopupImage');
const LoginDetail = require('./LoginDetail');
const SalesPricePolicy = require('./SalesPricePolicy');
const Product = require('./Product');
const Tag = require('./Tag');
const Wall = require('./Wall');
const TypeMaster = require('./TypeMaster');
const PriorityMaster = require('./PriorityMaster');
const CurrencyMaster = require('./CurrencyMaster');
const ChoreiMessage = require('./ChoreiMessage');
const Dashboard = require('./Dashboard');
const Region = require('./Region');
const TicketAssignee = require('./TicketAssignee');
const TicketFeedback = require('./TicketFeedback');
const TicketFollower = require('./TicketFollower');

const MeetingRequest = require('./MeetingRequest');
const Category = require('./Category');
const WallLike = require('./WallLike');
const WallComment = require('./WallComment');
const TodaysBirthdateAndAnniversary = require('./TodaysBirthdateAndAnniversary');
// Claim model removed as per user request

// Define associations
Department.hasMany(Employee, { foreignKey: 'DepartmentId', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'DepartmentId', as: 'department' });

Department.hasMany(Designation, { foreignKey: 'DepartmentId', as: 'designations' });
Designation.belongsTo(Department, { foreignKey: 'DepartmentId', as: 'department' });

Designation.hasMany(Employee, { foreignKey: 'DesignationId', as: 'employees' });
Employee.belongsTo(Designation, { foreignKey: 'DesignationId', as: 'designation' });

Role.hasMany(Employee, { foreignKey: 'RoleId', as: 'employees' });
Employee.belongsTo(Role, { foreignKey: 'RoleId', as: 'role' });

Unit.hasMany(Zone, { foreignKey: 'Unit', as: 'zones', constraints: false });
Zone.belongsTo(Unit, { foreignKey: 'Unit', as: 'unit', constraints: false });

Unit.hasMany(ExpenseLocation, { foreignKey: 'UnitId', as: 'expenseLocations', constraints: false });
ExpenseLocation.belongsTo(Unit, { foreignKey: 'UnitId', as: 'unit', constraints: false });

// Associations for Employee (Unit, Zone, Location) are removed because in the legacy schema
// these fields in Employee are Strings, whereas the referenced tables have Integer/BigInt IDs.
// We cannot form a Foreign Key relationship.

Location.hasMany(Floor, { foreignKey: 'LocationId', as: 'floors' });
Floor.belongsTo(Location, { foreignKey: 'LocationId', as: 'location' });



Floor.hasMany(Room, { foreignKey: 'FloorId', as: 'rooms' });
Room.belongsTo(Floor, { foreignKey: 'FloorId', as: 'floor' });

Room.hasMany(MeetingRequest, { foreignKey: 'RoomId', as: 'meetingRequests', constraints: false });
MeetingRequest.belongsTo(Room, { foreignKey: 'RoomId', as: 'room', constraints: false });

Room.belongsTo(Location, { foreignKey: 'Location', as: 'location', constraints: false });

Employee.hasMany(MeetingRequest, { foreignKey: 'UserId', as: 'meetingRequests', constraints: false });
MeetingRequest.belongsTo(Employee, { foreignKey: 'UserId', as: 'bookedBy', constraints: false });

Employee.hasMany(Ticket, { foreignKey: 'Requester', as: 'tickets', constraints: false });
Ticket.belongsTo(Employee, { foreignKey: 'Requester', as: 'employee', constraints: false });

Ticket.hasMany(TicketReply, { foreignKey: 'TicketId', as: 'replies', constraints: false });
TicketReply.belongsTo(Ticket, { foreignKey: 'TicketId', as: 'ticket', constraints: false });

Employee.hasMany(Wall, { foreignKey: 'AddedBy', as: 'walls', constraints: false });
Wall.belongsTo(Employee, { foreignKey: 'AddedBy', as: 'addedBy', constraints: false });

Notice.belongsTo(Role, { foreignKey: 'Role', as: 'role' });

Employee.hasMany(QuoteOfTheDay, { foreignKey: 'AddedBy', as: 'quotes', constraints: false });
QuoteOfTheDay.belongsTo(Employee, { foreignKey: 'AddedBy', as: 'addedBy', constraints: false });

Employee.hasMany(ChoreiMessage, { foreignKey: 'AddedBy', as: 'choreiMessages', constraints: false });
ChoreiMessage.belongsTo(Employee, { foreignKey: 'AddedBy', as: 'addedBy', constraints: false });
ChoreiMessage.belongsTo(Role, { foreignKey: 'Role', as: 'role', constraints: false });

Message.belongsTo(Role, { foreignKey: 'RoleId', as: 'role', constraints: false });
Message.belongsTo(Employee, { foreignKey: 'AddedBy', as: 'addedBy', constraints: false });

Auditor.belongsTo(Unit, { foreignKey: 'Unit', as: 'unit', constraints: false });
Auditor.belongsTo(Zone, { foreignKey: 'Zone', as: 'zone', constraints: false });
Auditor.belongsTo(Location, { foreignKey: 'Location', as: 'location', constraints: false });

Accountant.belongsTo(Employee, { foreignKey: 'EmployeeId', as: 'employee', constraints: false });

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
  MeetingRequest,
  Accountant,
  Auditor,
  ExpenseLocation,
  CustomImage,
  CompanyImage,
  PhotoGallery,
  PopupImage,
  LoginDetail,
  SalesPricePolicy,
  Product,
  Tag,
  Wall,
  TypeMaster,
  PriorityMaster,
  CurrencyMaster,
  ChoreiMessage,
  Dashboard,
  Category,
  WallLike,
  WallComment,
  TodaysBirthdateAndAnniversary,
  Region,
  TicketAssignee,
  TicketFeedback,
  TicketFollower,
};

// Wall Associations
Wall.hasMany(WallLike, { foreignKey: 'WallId', as: 'likes' });
WallLike.belongsTo(Wall, { foreignKey: 'WallId' });
Employee.hasMany(WallLike, { foreignKey: 'EmployeeId', as: 'wallLikes' });
WallLike.belongsTo(Employee, { foreignKey: 'EmployeeId', as: 'employee' });

Wall.hasMany(WallComment, { foreignKey: 'WallId', as: 'comments' });
WallComment.belongsTo(Wall, { foreignKey: 'WallId' });
Employee.hasMany(WallComment, { foreignKey: 'EmployeeId', as: 'wallComments' });
WallComment.belongsTo(Employee, { foreignKey: 'EmployeeId', as: 'employee' });

// Wish Associations
TodaysBirthdateAndAnniversary.belongsTo(Employee, { foreignKey: 'BirthdateUsertId', as: 'recipient', constraints: false });
TodaysBirthdateAndAnniversary.belongsTo(Employee, { foreignKey: 'CommentUserId', as: 'sender', constraints: false });



// Ticket Module Associations
Ticket.hasMany(TicketAssignee, { foreignKey: 'TicketId', as: 'assignees', constraints: false });
TicketAssignee.belongsTo(Ticket, { foreignKey: 'TicketId', as: 'ticket', constraints: false });

Ticket.hasMany(TicketFeedback, { foreignKey: 'TicketId', as: 'feedbacks', constraints: false });
TicketFeedback.belongsTo(Ticket, { foreignKey: 'TicketId', as: 'ticket', constraints: false });

Ticket.hasMany(TicketFollower, { foreignKey: 'TicketId', as: 'followers', constraints: false });
TicketFollower.belongsTo(Ticket, { foreignKey: 'TicketId', as: 'ticket', constraints: false });

Ticket.belongsTo(Region, { foreignKey: 'Region', targetKey: 'Id', as: 'regionRelation', constraints: false });
Ticket.belongsTo(City, { foreignKey: 'City', targetKey: 'Id', as: 'cityRelation', constraints: false });
Ticket.belongsTo(TypeMaster, { foreignKey: 'TypeId', as: 'categoryType', constraints: false });
Ticket.belongsTo(PriorityMaster, { foreignKey: 'PreorityId', as: 'priority', constraints: false });
Ticket.belongsTo(Tag, { foreignKey: 'TagId', as: 'tag', constraints: false });

TicketAssignee.belongsTo(Employee, { foreignKey: 'AssigneeId', as: 'assigneeEmployee', constraints: false });
TicketFeedback.belongsTo(Employee, { foreignKey: 'FeedBackBy', as: 'feedbackByEmployee', constraints: false });
TicketFollower.belongsTo(Employee, { foreignKey: 'FollowerId', as: 'followerEmployee', constraints: false });
TicketReply.belongsTo(Employee, { foreignKey: 'RepliedbyBy', as: 'repliedByEmployee', constraints: false });

module.exports = db;
