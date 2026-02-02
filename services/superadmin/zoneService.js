const db = require('../../models');
const { Zone, Unit } = db;
const { Op } = require('sequelize');

exports.getAllZones = async (page = 1, limit = null, unitId = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = { IsDeleted: false };
    if (unitId) whereClause.UnitId = unitId;
    if (search) whereClause.Title = { [Op.like]: `%${search}%` };

    const queryOptions = {
        where: whereClause,
        include: [{ model: Unit, as: 'unit' }],
        order: [['Id', 'DESC']] // Correctly placed order clause
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return Zone.findAndCountAll(queryOptions);
};
exports.getZoneById = async (id) => Zone.findByPk(id, { include: [{ model: Unit, as: 'unit' }] });
exports.createZone = async (data) => Zone.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateZone = async (item, data) => item.update(data);
exports.deleteZone = async (item) => item.update({ IsDeleted: true });
