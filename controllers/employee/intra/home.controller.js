
const Dashboard = require('../../../models');
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { ChoreiMessage, News, Event, Product, PhotoGallery, Employee, Notice } = require('../../../models/superAdmin');




const getChoreiMessages = async (limit = null) => {
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

const getEmergencyResponse = async () => {
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

const getCorporateNews = async (limit = null) => {
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

const getUpcomingEvents = async (limit = null) => {
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

const getUpcomingBirthdays = async () => {
    // Using existing static method on Employee model
    return await Employee.getUpcomingBirthdays();
};

const getProducts = async (limit = null) => {
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

const getNewEmployees = async (limit = null) => {
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

const getWorkAnniversary = async () => {
    return await Dashboard.getWorkAnniversary(); // Reuse reliable SP
};

const getGallery = async (limit = null) => {
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

// -----------------------------


const sendResponse = (res, success, data, message = 'Success') => {
    if (success) {
        res.status(200).json({ success: true, message, data });
    } else {
        res.status(500).json({ success: false, message });
    }
};

const handleRequest = async (res, serviceMethod, ...args) => {
    try {
        const data = await serviceMethod(...args);
        sendResponse(res, true, data);
    } catch (error) {
        console.error('Error in controller:', error);
        sendResponse(res, false, null, error.message);
    }
};

exports.getChoreiMessages = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, getChoreiMessages, limit);
};

exports.getEmergencyResponse = async (req, res) => {
    await handleRequest(res, getEmergencyResponse);
};

exports.getCorporateNews = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, getCorporateNews, limit);
};

exports.getUpcomingEvents = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, getUpcomingEvents, limit);
};

exports.getUpcomingBirthdays = async (req, res) => {
    await handleRequest(res, getUpcomingBirthdays);
};

exports.getProducts = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, getProducts, limit);
};

exports.getNewEmployees = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, getNewEmployees, limit);
};

exports.getWorkAnniversary = async (req, res) => {
    await handleRequest(res, getWorkAnniversary);
};

exports.getGallery = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, getGallery, limit);
};
