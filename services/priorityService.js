const db = require('../models');
const { PriorityMaster } = db;

const { Op } = require('sequelize');

exports.getAllPriorities = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        }
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return PriorityMaster.findAndCountAll(queryOptions);
};
exports.getPriorityById = async (id) => PriorityMaster.findByPk(id);
exports.createPriority = async (data) => PriorityMaster.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updatePriority = async (item, data) => item.update(data);
exports.deletePriority = async (item) => item.update({ IsDeleted: true });
