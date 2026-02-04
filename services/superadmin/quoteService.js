const db = require('../../models');
const { QuoteOfTheDay, Employee } = db;

const { Op } = require('sequelize');

/**
 * Get all quotes
 * @returns {Promise<Array>} List of quotes
 */
exports.getAllQuotes = async (page = 1, limit = null, search = '') => {
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
    if (data.Quote) {
        const existing = await QuoteOfTheDay.findOne({
            where: {
                Quote: data.Quote,
                IsDeleted: { [Op.or]: [false, 0, null] }
            }
        });
        if (existing) {
            throw new Error('Quote already exists');
        }
    }
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
    if (data.Quote && data.Quote !== quote.Quote) {
        const existing = await QuoteOfTheDay.findOne({
            where: {
                Quote: data.Quote,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: quote.Id }
            }
        });
        if (existing) {
            throw new Error('Quote already exists');
        }
    }
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
