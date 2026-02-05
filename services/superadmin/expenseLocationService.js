const db = require('../../models');
const { ExpenseLocation } = db;
const { Op } = require('sequelize');

exports.getAllExpenseLocations = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    // Treat invalid, 0, or negative limit as unlimited (null)
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const where = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    if (search) {
        where.Title = { [Op.like]: `%${search}%` };
    }

    const queryOptions = {
        where,
        order: [['Id', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await ExpenseLocation.findAndCountAll(queryOptions);
};

exports.getExpenseLocationById = async (id) => {
    return await ExpenseLocation.findByPk(id);
};

exports.createExpenseLocation = async (data) => {
    const whereClause = {
        Title: data.Title,
        ZoneId: data.ZoneId || null,
        UnitId: data.UnitId || null,
        IsDeleted: { [Op.or]: [false, 0, null] }
    };

    const existing = await ExpenseLocation.findOne({ where: whereClause });

    if (existing) {
        throw new Error('Expense Location with this title, zone, and unit already exists');
    }
    return await ExpenseLocation.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

exports.updateExpenseLocation = async (location, data) => {
    const newTitle = data.Title || location.Title;
    const newZoneId = data.ZoneId !== undefined ? data.ZoneId : location.ZoneId;
    const newUnitId = data.UnitId !== undefined ? data.UnitId : location.UnitId;

    if (newTitle !== location.Title || newZoneId !== location.ZoneId || newUnitId !== location.UnitId) {
        const whereClause = {
            Title: newTitle,
            ZoneId: newZoneId || null,
            UnitId: newUnitId || null,
            IsDeleted: { [Op.or]: [false, 0, null] },
            Id: { [Op.ne]: location.Id }
        };

        const existing = await ExpenseLocation.findOne({ where: whereClause });

        if (existing) {
            throw new Error('Expense Location with this title, zone, and unit already exists');
        }
    }
    return await location.update(data);
};

exports.deleteExpenseLocation = async (location) => {
    return await location.update({ IsDeleted: true });
};
