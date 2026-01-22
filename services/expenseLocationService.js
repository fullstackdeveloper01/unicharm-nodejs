const db = require('../models');
const { ExpenseLocation } = db;
const { Op } = require('sequelize');

exports.getAllExpenseLocations = async () => {
    return await ExpenseLocation.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        }
    });
};

exports.getExpenseLocationById = async (id) => {
    return await ExpenseLocation.findByPk(id);
};

exports.createExpenseLocation = async (data) => {
    return await ExpenseLocation.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

exports.updateExpenseLocation = async (location, data) => {
    return await location.update(data);
};

exports.deleteExpenseLocation = async (location) => {
    return await location.update({ IsDeleted: true });
};
