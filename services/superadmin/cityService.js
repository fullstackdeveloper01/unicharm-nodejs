const db = require('../../models');
const { City } = db;

const { Op } = require('sequelize');

exports.getAllCities = async (page = 1, limit = null, search = '') => {
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

    // Add search functionality
    if (search) {
        whereClause[Op.and] = [
            {
                Name: { [Op.like]: `%${search}%` }
            }
        ];
    }

    const queryOptions = {
        where: whereClause,
        order: [['Name', 'ASC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return City.findAndCountAll(queryOptions);
};
exports.getCityById = async (id) => City.findByPk(id);
exports.createCity = async (data) => {
    const existing = await City.findOne({
        where: {
            Name: data.Name,
            StateId: data.StateId,
            IsDeleted: { [Op.or]: [false, 0, null] }
        }
    });

    if (existing) {
        throw new Error('City with this name already exists in the selected state');
    }
    return City.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};
exports.updateCity = async (item, data) => {
    const newName = data.Name || item.Name;
    const newStateId = data.StateId || item.StateId;

    if (newName !== item.Name || newStateId !== item.StateId) {
        const existing = await City.findOne({
            where: {
                Name: newName,
                StateId: newStateId,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: item.Id }
            }
        });

        if (existing) {
            throw new Error('City with this name already exists in the selected state');
        }
    }
    return item.update(data);
};
exports.deleteCity = async (item) => item.update({ IsDeleted: true });
