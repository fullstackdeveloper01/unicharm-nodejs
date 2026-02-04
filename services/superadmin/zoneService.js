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
exports.createZone = async (data) => {
    const existing = await Zone.findOne({
        where: {
            Title: data.Title,
            UnitId: data.UnitId,
            IsDeleted: false
        }
    });
    if (existing) {
        throw new Error('Zone with this title already exists in the selected Unit');
    }
    return Zone.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};
exports.updateZone = async (item, data) => {
    const newTitle = data.Title || item.Title;
    const newUnitId = data.UnitId || item.UnitId;

    if (newTitle !== item.Title || newUnitId !== item.UnitId) {
        const existing = await Zone.findOne({
            where: {
                Title: newTitle,
                UnitId: newUnitId,
                IsDeleted: false,
                Id: { [Op.ne]: item.Id }
            }
        });
        if (existing) {
            throw new Error('Zone with this title already exists in the selected Unit');
        }
    }
    return item.update(data);
};
exports.deleteZone = async (item) => item.update({ IsDeleted: true });
