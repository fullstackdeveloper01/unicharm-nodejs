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
        order: [['Id', 'DESC']] // Show newest first
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return City.findAndCountAll(queryOptions);
};
exports.getCityById = async (id) => City.findByPk(id);
exports.createCity = async (data) => {
    // Validate required fields
    if (!data.Name) {
        throw new Error('City Name is required');
    }

    const name = data.Name.trim();
    const stateId = data.StateId || null;

    const existing = await City.findOne({
        where: {
            Name: name,
            StateId: stateId,
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: 0 }
            ]
        }
    });

    if (existing) {
        throw new Error('City with this name already exists in the selected state');
    }

    // Workaround: Generate next ID manually because DB table seems to lack AUTO_INCREMENT
    const lastCity = await City.findOne({
        order: [['Id', 'DESC']],
        paranoid: false
    });
    const nextId = (lastCity && lastCity.Id) ? parseInt(lastCity.Id) + 1 : 1;

    // Use clean data object to avoid passing unexpected fields
    return City.create({
        Id: nextId,
        Name: name,
        StateId: stateId,
        IsDeleted: false
    });
};
exports.updateCity = async (item, data) => {
    let newName = item.Name;
    if (data.Name) {
        newName = data.Name.trim();
    }

    // Only use new StateId if provided, else keep existing
    const newStateId = (data.StateId !== undefined) ? data.StateId : item.StateId;

    if (newName !== item.Name || newStateId !== item.StateId) {
        const existing = await City.findOne({
            where: {
                Name: newName,
                StateId: newStateId,
                [Op.or]: [{ IsDeleted: false }, { IsDeleted: 0 }],
                Id: { [Op.ne]: item.Id }
            }
        });

        if (existing) {
            throw new Error('City with this name already exists in the selected state');
        }
    }

    const updateData = { ...data };
    if (data.Name) updateData.Name = newName;

    return item.update(updateData);
};
exports.deleteCity = async (item) => item.update({ IsDeleted: true });
