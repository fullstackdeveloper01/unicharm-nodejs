const db = require('../models');
const { QuoteOfTheDay, Employee } = db;

const { Op } = require('sequelize');

/**
 * Get all quotes
 * @returns {Promise<Array>} List of quotes
 */
exports.getAllQuotes = async () => {
    return await QuoteOfTheDay.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        include: [
            { model: Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName'] }
        ],
        order: [['CreatedOn', 'DESC']]
    });
};

/**
 * Get quote by ID
 * @param {number} id - Quote ID
 * @returns {Promise<Object>} Quote
 */
exports.getQuoteById = async (id) => {
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
exports.createQuote = async (data) => {
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
exports.updateQuote = async (quote, data) => {
    return await quote.update(data);
};

/**
 * Delete quote (soft delete)
 * @param {Object} quote - Quote instance
 * @returns {Promise<Object>} Deleted quote
 */
exports.deleteQuote = async (quote) => {
    return await quote.update({ IsDeleted: true });
};
