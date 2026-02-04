const db = require('../../models');
const { CurrencyMaster, Sequelize } = db;
const { Op } = Sequelize;

exports.getAllCurrencies = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = { IsDeleted: false };
    if (search) whereClause.Title = { [Op.like]: `%${search}%` };

    const queryOptions = {
        where: whereClause,
        order: [['Id', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return CurrencyMaster.findAndCountAll(queryOptions);
};
exports.getCurrencyById = async (id) => CurrencyMaster.findByPk(id);
exports.createCurrency = async (data) => {
    const existing = await CurrencyMaster.findOne({
        where: {
            Title: data.Title,
            IsDeleted: { [Op.or]: [false, 0, null] } // Ensure we don't duplicate existing active currencies
        }
    });

    if (existing) {
        throw new Error('Currency with this title already exists');
    }
    return CurrencyMaster.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};
exports.updateCurrency = async (item, data) => {
    if (data.Title && data.Title !== item.Title) {
        const existing = await CurrencyMaster.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: item.Id }
            }
        });

        if (existing) {
            throw new Error('Currency with this title already exists');
        }
    }
    return item.update(data);
};
exports.deleteCurrency = async (item) => item.update({ IsDeleted: true });
