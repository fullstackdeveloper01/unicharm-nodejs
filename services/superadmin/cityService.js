const db = require('../../models');
const { City } = db;

const { Op } = require('sequelize');

exports.getAllCities = async (page = 1, limit = null) => {
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

    return City.findAndCountAll(queryOptions);
};
exports.getCityById = async (id) => City.findByPk(id);
exports.createCity = async (data) => City.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateCity = async (item, data) => item.update(data);
exports.deleteCity = async (item) => item.update({ IsDeleted: true });
