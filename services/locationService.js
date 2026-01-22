const db = require('../models');
const { Location } = db;

const { Op } = require('sequelize');

exports.getAllLocations = async () => {
    return await Location.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        }
    });
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
