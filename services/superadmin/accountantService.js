const db = require('../../models');
const { Accountant, Employee } = db;
const { Op } = require('sequelize');

exports.getAllAccountants = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = { IsDeleted: false };
    if (search) whereClause.Name = { [Op.like]: `%${search}%` };

    const queryOptions = {
        where: whereClause,
        include: [{ model: Employee, as: 'employee' }],
        order: [['Id', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return Accountant.findAndCountAll(queryOptions);
};
exports.getAccountantById = async (id) => Accountant.findByPk(id, { include: [{ model: Employee, as: 'employee' }] });
exports.createAccountant = async (data) => {
    if (data.UserName) {
        const existing = await Accountant.findOne({
            where: {
                UserName: data.UserName,
                IsDeleted: { [Op.or]: [false, 0, null] }
            }
        });
        if (existing) {
            throw new Error('Accountant/Admin with this UserName already exists');
        }
    }
    return Accountant.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};
exports.updateAccountant = async (item, data) => {
    if (data.UserName && data.UserName !== item.UserName) {
        const existing = await Accountant.findOne({
            where: {
                UserName: data.UserName,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: item.Id }
            }
        });
        if (existing) {
            throw new Error('Accountant/Admin with this UserName already exists');
        }
    }
    return item.update(data);
};
exports.deleteAccountant = async (item) => item.update({ IsDeleted: true });
