const db = require('../models');
const { Unit } = db;

exports.getAllUnits = async () => Unit.findAll({ where: { IsDeleted: false } });
exports.getUnitById = async (id) => Unit.findByPk(id);
exports.createUnit = async (data) => Unit.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateUnit = async (item, data) => item.update(data);
exports.deleteUnit = async (item) => item.update({ IsDeleted: true });
