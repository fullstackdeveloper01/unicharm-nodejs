const db = require('../../models');
const { ChoreiMessage, News, Event, Product, PhotoGallery, Employee, Notice } = db;
const Dashboard = require('../../models/Dashboard');
const { Op } = require('sequelize');

exports.getChoreiMessages = async (limit = null) => {
    const options = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: 0 },
                { IsDeleted: null }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    };
    if (limit) options.limit = parseInt(limit);
    return await ChoreiMessage.findAll(options);
};

exports.getEmergencyResponse = async () => {
    // Placeholder: Look for Notices with 'Emergency' in title
    // or specific logic if provided later.
    return await Notice.findAll({
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        { IsDeleted: false },
                        { IsDeleted: 0 },
                        { IsDeleted: null }
                    ]
                },
                { Title: { [Op.like]: '%Emergency%' } }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    });
};

exports.getCorporateNews = async (limit = null) => {
    const options = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: 0 },
                { IsDeleted: null }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    };
    if (limit) options.limit = parseInt(limit);
    return await News.findAll(options);
};

exports.getUpcomingEvents = async (limit = null) => {
    const today = new Date();
    const options = {
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        { IsDeleted: false },
                        { IsDeleted: 0 },
                        { IsDeleted: null }
                    ]
                },
                {
                    [Op.or]: [
                        { EventDate: { [Op.gte]: today } },
                        { EventDate: null } // Include nulls if any, to be safe, or remove this line
                    ]
                }
            ]
        },
        order: [['EventDate', 'ASC'], ['CreatedOn', 'DESC']] // Earliest upcoming event first
    };
    if (limit) options.limit = parseInt(limit);
    return await Event.findAll(options);
};

exports.getUpcomingBirthdays = async () => {
    // Using existing static method on Employee model
    return await Employee.getUpcomingBirthdays();
};

exports.getProducts = async (limit = null) => {
    const options = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: 0 },
                { IsDeleted: null }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    };
    if (limit) options.limit = parseInt(limit);
    return await Product.findAll(options);
};

exports.getNewEmployees = async (limit = null) => {
    const options = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: 0 },
                { IsDeleted: null }
            ]
        },
        order: [['Joiningdate', 'DESC']],
        include: [
            { model: db.Department, as: 'department', attributes: ['DepartmentName'] },
            { model: db.Designation, as: 'designation', attributes: ['DesignationName'] }
        ]
    };
    if (limit) options.limit = parseInt(limit);

    const employees = await Employee.findAll(options);

    // Map to clean structure
    return employees.map(emp => ({
        Id: emp.Id,
        Name: `${emp.FirstName} ${emp.LastName || ''}`.trim(),
        JoiningDate: emp.Joiningdate,
        UserPhoto: emp.UserPhoto,
        Department: emp.department ? emp.department.DepartmentName : '',
        Designation: emp.designation ? emp.designation.DesignationName : ''
    }));
};

exports.getWorkAnniversary = async () => {
    return await Dashboard.getWorkAnniversary(); // Reuse reliable SP
};

exports.getGallery = async (limit = null) => {
    const options = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: 0 },
                { IsDeleted: null }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    };
    if (limit) options.limit = parseInt(limit);
    return await PhotoGallery.findAll(options);
};
