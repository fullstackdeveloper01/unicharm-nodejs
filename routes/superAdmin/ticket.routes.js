const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/superAdmin/ticket.controller.js');

// Ticket routes
router.get('/assignee', ticketController.getTicketsForAssignee); // Uses stored procedure
router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', ticketController.createTicket);
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
