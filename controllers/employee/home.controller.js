const homeService = require('../../services/employee/home.service');

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
    await handleRequest(res, homeService.getChoreiMessages, limit);
};

exports.getEmergencyResponse = async (req, res) => {
    await handleRequest(res, homeService.getEmergencyResponse);
};

exports.getCorporateNews = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, homeService.getCorporateNews, limit);
};

exports.getUpcomingEvents = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, homeService.getUpcomingEvents, limit);
};

exports.getUpcomingBirthdays = async (req, res) => {
    await handleRequest(res, homeService.getUpcomingBirthdays);
};

exports.getProducts = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, homeService.getProducts, limit);
};

exports.getNewEmployees = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, homeService.getNewEmployees, limit);
};

exports.getWorkAnniversary = async (req, res) => {
    await handleRequest(res, homeService.getWorkAnniversary);
};

exports.getGallery = async (req, res) => {
    const { limit } = req.query;
    await handleRequest(res, homeService.getGallery, limit);
};
