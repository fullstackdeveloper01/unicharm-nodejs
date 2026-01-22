const db = require('../models');
const { PriorityMaster } = db;

const { Op } = require('sequelize');

exports.getAllPriorities = async () => PriorityMaster.findAll({
    where: {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    }
});
exports.getPriorityById = async (id) => PriorityMaster.findByPk(id);
exports.createPriority = async (data) => PriorityMaster.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updatePriority = async (item, data) => item.update(data);
exports.deletePriority = async (item) => item.update({ IsDeleted: true });
