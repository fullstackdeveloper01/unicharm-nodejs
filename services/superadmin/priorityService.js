const db = require('../../models');
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
exports.createPriority = async (data) => {
    const existing = await PriorityMaster.findOne({
        where: {
            Title: data.Title,
            IsDeleted: { [Op.or]: [false, 0, null] }
        }
    });

    if (existing) {
        throw new Error('Priority with this title already exists');
    }
    return PriorityMaster.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};
exports.updatePriority = async (item, data) => {
    if (data.Title && data.Title !== item.Title) {
        const existing = await PriorityMaster.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: item.Id }
            }
        });

        if (existing) {
            throw new Error('Priority with this title already exists');
        }
    }
    return item.update(data);
};
exports.deletePriority = async (item) => item.update({ IsDeleted: true });
