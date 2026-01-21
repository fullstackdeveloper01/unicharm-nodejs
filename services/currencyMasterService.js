const db = require('../models');
const { CurrencyMaster, Sequelize } = db;
const { Op } = Sequelize;

exports.getAllCurrencies = async () => CurrencyMaster.findAll();
exports.getCurrencyById = async (id) => CurrencyMaster.findByPk(id);
exports.createCurrency = async (data) => CurrencyMaster.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateCurrency = async (item, data) => item.update(data);
exports.deleteCurrency = async (item) => item.update({ IsDeleted: true });
