const quoteService = require('../services/quoteService');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all quotes
exports.getAllQuotes = async (req, res) => {
    try {
        const quotes = await quoteService.getAllQuotes();
        sendResponse(res, true, 'Quotes retrieved successfully', quotes);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve quotes', null, { message: error.message });
    }
};

// Get quote by ID
exports.getQuoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await quoteService.getQuoteById(id);

        if (!quote) {
            return sendResponse(res, false, 'Quote not found');
        }

        sendResponse(res, true, 'Quote retrieved successfully', quote);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve quote', null, { message: error.message });
    }
};

// Create quote
exports.createQuote = async (req, res) => {
    try {
        const { Title, Quote, AddedBy } = req.body;

        const quote = await quoteService.createQuote({ Title, Quote, AddedBy });
        res.status(201);
        sendResponse(res, true, 'Quote created successfully', quote);
    } catch (error) {
        sendResponse(res, false, 'Failed to create quote', null, { message: error.message });
    }
};

// Update quote
exports.updateQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const { Title, Quote, AddedBy } = req.body;

        const quoteObj = await quoteService.getQuoteById(id);
        if (!quoteObj) {
            return sendResponse(res, false, 'Quote not found');
        }

        const updatedQuote = await quoteService.updateQuote(quoteObj, { Title, Quote, AddedBy });
        sendResponse(res, true, 'Quote updated successfully', updatedQuote);
    } catch (error) {
        sendResponse(res, false, 'Failed to update quote', null, { message: error.message });
    }
};

// Delete quote (soft delete)
exports.deleteQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await quoteService.getQuoteById(id);

        if (!quote) {
            return sendResponse(res, false, 'Quote not found');
        }

        await quoteService.deleteQuote(quote);
        sendResponse(res, true, 'Quote deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete quote', null, { message: error.message });
    }
};
