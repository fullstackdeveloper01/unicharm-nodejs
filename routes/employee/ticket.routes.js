const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/employee/ticket.controller');
const verifyToken = require('../../middlewares/auth.middleware');

router.use(verifyToken);

// 1) MY TICKETS
router.get('/my-summary', ticketController.getMyTicketSummary);
router.get('/my-list', ticketController.getMyTicketList);
router.get('/details/:id', ticketController.getTicketDetails);

// 2) NEW TICKET
router.get('/employee-details', ticketController.getEmployeeDetails);
router.get('/dropdowns', ticketController.getDropdowns);
router.post('/create', ticketController.uploadMiddleware, ticketController.createTicket);

// 3) TICKET REQUEST (Organization Level)
// These might require Admin/IT role check, but user said "Employee based access"
// I will keep them protected by verifyToken.
router.get('/org-summary', ticketController.getOrganizationTicketSummary);
router.get('/org-list', ticketController.getOrganizationTicketList);

// 4) TICKET REPORT
router.get('/report-summary', ticketController.getTicketReportSummary);
router.get('/report-graph', ticketController.getTicketReportGraph);
router.get('/report-download', ticketController.downloadReport);

// 5) TICKET REPLY & FEEDBACK
router.get('/:ticketId/replies', ticketController.getReplies);
router.post('/:ticketId/reply', ticketController.uploadMiddleware, ticketController.sendReply);
router.post('/assign', ticketController.transferTicket); // New Route for Transfer
router.post('/:ticketId/feedback', ticketController.submitFeedback);

module.exports = router;
