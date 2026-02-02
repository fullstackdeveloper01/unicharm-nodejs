const db = require('../../models');
const { Location } = db;

const { Op } = require('sequelize');

exports.getAllLocations = async (page = 1, limit = null, zoneId = null) => {
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
    return await Location.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

exports.updateLocation = async (location, data) => {
    return await location.update(data);
};

exports.deleteLocation = async (location) => {
    return await location.update({ IsDeleted: true });
};
