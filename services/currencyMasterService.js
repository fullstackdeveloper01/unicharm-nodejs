const db = require('../models');
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
exports.createCurrency = async (data) => CurrencyMaster.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateCurrency = async (item, data) => item.update(data);
exports.deleteCurrency = async (item) => item.update({ IsDeleted: true });
