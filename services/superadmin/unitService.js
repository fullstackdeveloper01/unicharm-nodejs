const db = require('../../models');
const { Unit } = db;
const { Op } = require('sequelize');

exports.getAllUnits = async (page = 1, limit = null, search = '') => {
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

    return Unit.findAndCountAll(queryOptions);
};
exports.getUnitById = async (id) => Unit.findByPk(id);
exports.createUnit = async (data) => {
    const existing = await Unit.findOne({
        where: { Title: data.Title, IsDeleted: false }
    });
    if (existing) {
        throw new Error('Unit with this title already exists');
    }
    return Unit.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};
exports.updateUnit = async (item, data) => {
    if (data.Title && data.Title !== item.Title) {
        const existing = await Unit.findOne({
            where: {
                Title: data.Title,
                IsDeleted: false,
                Id: { [Op.ne]: item.Id }
            }
        });
        if (existing) {
            throw new Error('Unit with this title already exists');
        }
    }
    return item.update(data);
};
exports.deleteUnit = async (item) => item.update({ IsDeleted: true });
