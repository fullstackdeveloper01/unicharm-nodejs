const db = require('../../models');
const { Auditor, Unit, Zone, Location } = db;
const { Op } = require('sequelize');

exports.getAllAuditors = async (page = 1, limit = null, filters = {}) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = { IsDeleted: false };

    if (filters.unitId) whereClause.UnitId = filters.unitId;
    if (filters.zoneId) whereClause.ZoneId = filters.zoneId;
    if (filters.locationId) whereClause.LocationId = filters.locationId;

    // Add search functionality
    if (filters.search) {
        whereClause.Name = { [Op.like]: `%${filters.search}%` };
    }

    const queryOptions = {
        where: whereClause,
        include: [
            { model: Unit, as: 'unit' },
            { model: Zone, as: 'zone' },
            { model: Location, as: 'location' }
        ]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return Auditor.findAndCountAll(queryOptions);
};
exports.getAuditorById = async (id) => Auditor.findByPk(id, {
    include: [
        { model: Unit, as: 'unit' },
        { model: Zone, as: 'zone' },
        { model: Location, as: 'location' }
    ]
});
exports.createAuditor = async (data) => {
    if (data.Email) {
        const existing = await Auditor.findOne({
            where: {
                Email: data.Email,
                IsDeleted: { [Op.or]: [false, 0, null] }
            }
        });
        if (existing) {
            throw new Error('Auditor with this email already exists');
        }
    }
    return Auditor.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};
exports.updateAuditor = async (item, data) => {
    if (data.Email && data.Email !== item.Email) {
        const existing = await Auditor.findOne({
            where: {
                Email: data.Email,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: item.Id }
            }
        });
        if (existing) {
            throw new Error('Auditor with this email already exists');
        }
    }
    return item.update(data);
};
exports.deleteAuditor = async (item) => item.update({ IsDeleted: true });
