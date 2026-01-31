
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { QuoteOfTheDay } = require('../../models/employee/intra');
const { Employee } = require('../../models/superAdmin');




/**
 * Get all quotes
 * @returns {Promise<Array>} List of quotes
 */
const getAllQuotes = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    if (search) {
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({ Quote: { [Op.like]: `%${search}%` } });
    }

    const queryOptions = {
        where: whereClause,
        include: [
            { model: Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName'] }
        ],
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await QuoteOfTheDay.findAndCountAll(queryOptions);
};

/**
 * Get quote by ID
 * @param {number} id - Quote ID
 * @returns {Promise<Object>} Quote
 */
const getQuoteById = async (id) => {
    return await QuoteOfTheDay.findByPk(id, {
        include: [
            { model: Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName'] }
        ]
    });
};

/**
 * Create quote
 * @param {Object} data - Quote data
 * @returns {Promise<Object>} Created quote
 */
const createQuote = async (data) => {
    return await QuoteOfTheDay.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update quote
 * @param {Object} quote - Quote instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated quote
 */
const updateQuote = async (quote, data) => {
    return await quote.update(data);
};

/**
 * Delete quote (soft delete)
 * @param {Object} quote - Quote instance
 * @returns {Promise<Object>} Deleted quote
 */
const deleteQuote = async (quote) => {
    return await quote.update({ IsDeleted: true });
};

// -----------------------------


// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all quotes
exports.getAllQuotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllQuotes(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Quotes retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve quotes', null, { message: error.message });
    }
};

// Get quote by ID
exports.getQuoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await getQuoteById(id);

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

        const quote = await createQuote({ Title, Quote, AddedBy });
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

        const quoteObj = await getQuoteById(id);
        if (!quoteObj) {
            return sendResponse(res, false, 'Quote not found');
        }

        const updatedQuote = await updateQuote(quoteObj, { Title, Quote, AddedBy });
        sendResponse(res, true, 'Quote updated successfully', updatedQuote);
    } catch (error) {
        sendResponse(res, false, 'Failed to update quote', null, { message: error.message });
    }
};

// Delete quote (soft delete)
exports.deleteQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await getQuoteById(id);

        if (!quote) {
            return sendResponse(res, false, 'Quote not found');
        }

        await deleteQuote(quote);
        sendResponse(res, true, 'Quote deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete quote', null, { message: error.message });
    }
};
