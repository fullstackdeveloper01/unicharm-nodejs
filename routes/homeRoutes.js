const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Dashboard and home routes using stored procedures
router.get('/dashboard', homeController.getDashboard);
router.get('/upcoming-birthdays', homeController.getUpComingBirthday);
router.get('/recent-news', homeController.getRecentNews);
router.get('/recent-events', homeController.getRecentEvent);
router.get('/recent-policies', homeController.getRecentPolicies);
router.get('/work-anniversaries', homeController.getWorkAnniversary);
router.get('/login-details', homeController.getLoginDetail);
router.get('/meetings/:employeeId', homeController.getMeetingsForUser);

module.exports = router;
