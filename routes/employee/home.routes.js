const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/employee/home.controller');
const { verifyToken } = require('../../middlewares/shared/auth');

// Note: Assuming these endpoints might need authentication. 
// If public, remove key verifyToken. 
// Requirement says "Home Page dashboard and Employee Authentication".
// Usually Employee App requires login first.
// I will apply verifyToken to all Home routes to be safe/secure.

router.get('/chorei-messages', verifyToken, homeController.getChoreiMessages);
router.get('/emergency-response', verifyToken, homeController.getEmergencyResponse);
router.get('/corporate-news', verifyToken, homeController.getCorporateNews);
router.get('/upcoming-events', verifyToken, homeController.getUpcomingEvents);
router.get('/upcoming-birthdays', verifyToken, homeController.getUpcomingBirthdays);
router.get('/products', verifyToken, homeController.getProducts);
router.get('/new-employees', verifyToken, homeController.getNewEmployees);
router.get('/work-anniversary', verifyToken, homeController.getWorkAnniversary);
router.get('/gallery', verifyToken, homeController.getGallery);

module.exports = router;
