const db = require('../models');
const { City } = db;

const { Op } = require('sequelize');

exports.getAllCities = async () => City.findAll({
    where: {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    }
});
exports.getCityById = async (id) => City.findByPk(id);
exports.createCity = async (data) => City.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateCity = async (item, data) => item.update(data);
exports.deleteCity = async (item) => item.update({ IsDeleted: true });
