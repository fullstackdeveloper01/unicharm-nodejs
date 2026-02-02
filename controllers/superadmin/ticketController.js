const db = require('../models');
const { Ticket, TicketReply, Employee } = db;
const storedProcedureService = require('../../services/storedProcedureService');

// Get tickets for assignee using stored procedure
exports.getTicketsForAssignee = async (req, res) => {
  try {
    const { employeeId } = req.query;

    let tickets;
    if (employeeId) {
      tickets = await storedProcedureService.getTicketForAssignee(parseInt(employeeId));
    } else {
      tickets = await storedProcedureService.getTicketForAssignee();
    }

    res.json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    const queryOptions = {
      where: { IsDeleted: false },
      include: [
        { model: Employee, as: 'employee', attributes: ['Id', 'FirstName', 'LastName', 'Email'] }
      ],
      order: [['CreatedOn', 'DESC']]
    };

    if (limit) {
      queryOptions.limit = limit;
      queryOptions.offset = (page - 1) * limit;
    }

    const { count, rows } = await Ticket.findAndCountAll(queryOptions);

    const pagination = {
      total: count,
      page: page,
      limit: limit || count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
      hasNext: limit ? page * limit < count : false
    };

    res.json({
      success: true,
      data: rows,
      pagination
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: TicketReply, as: 'replies' }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create ticket
exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      CreatedOn: new Date(),
      IsDeleted: false
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    await ticket.update(req.body);
    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete ticket (soft delete)
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    await ticket.update({ IsDeleted: true });
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
