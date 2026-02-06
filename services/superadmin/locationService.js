const db = require('../../models');
const { Location } = db;

const { Op } = require('sequelize');

exports.getAllLocations = async (page = 1, limit = null, zoneId = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };
    if (zoneId) whereClause.ZoneId = zoneId;

    // Add search filter
    if (search) {
        whereClause.LocationName = { [Op.like]: `%${search}%` };
    }

    const queryOptions = {
        where: whereClause
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Location.findAndCountAll(queryOptions);
};

exports.getLocationById = async (id) => {
    return await Location.findByPk(id);
};

exports.createLocation = async (data) => {
    const whereClause = { LocationName: data.LocationName, IsDeleted: false };
    if (data.ZoneId) whereClause.ZoneId = data.ZoneId;

    const existing = await Location.findOne({ where: whereClause });
    if (existing) {
        throw new Error('Location with this name already exists');
    }
    return await Location.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

exports.updateLocation = async (location, data) => {
    if (data.LocationName && data.LocationName !== location.LocationName) {
        const whereClause = {
            LocationName: data.LocationName,
            IsDeleted: false,
            Id: { [Op.ne]: location.Id }
        };
        // Check ZoneId if it's changing or use existing
        const zId = data.ZoneId !== undefined ? data.ZoneId : location.ZoneId;
        if (zId) whereClause.ZoneId = zId;

        const existing = await Location.findOne({ where: whereClause });
        if (existing) {
            throw new Error('Location with this name already exists');
        }
    }
    return await location.update(data);
};

exports.deleteLocation = async (location) => {
    return await location.update({ IsDeleted: true });
};
