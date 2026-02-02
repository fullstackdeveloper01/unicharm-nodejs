const db = require('../../models');
const { Floor, Location } = db;

const { Op } = require('sequelize');

exports.getAllFloors = async (page = 1, limit = null) => {
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
        },
        include: [{ model: Location, as: 'location' }]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Floor.findAndCountAll(queryOptions);
};

exports.getFloorById = async (id) => {
    return await Floor.findByPk(id, {
        include: [{ model: Location, as: 'location' }]
    });
};

exports.createFloor = async (data) => {
    return await Floor.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

exports.updateFloor = async (floor, data) => {
    return await floor.update(data);
};

exports.deleteFloor = async (floor) => {
    return await floor.update({ IsDeleted: true });
};

exports.getFloorsDropdown = async () => {
    const floors = await Floor.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        attributes: ['Id', 'FloorName', 'LocationId']
    });

    return floors.map(floor => ({
        value: floor.Id,
        label: floor.FloorName,
        locationId: floor.LocationId,
        LocationId: floor.LocationId,
        Location: floor.LocationId
    }));
};
