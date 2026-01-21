const db = require('../models');
const { Accountant, Employee } = db;

exports.getAllAccountants = async () => Accountant.findAll({
    where: { IsDeleted: false },
    include: [{ model: Employee, as: 'employee' }]
});
exports.getAccountantById = async (id) => Accountant.findByPk(id, { include: [{ model: Employee, as: 'employee' }] });
exports.createAccountant = async (data) => Accountant.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateAccountant = async (item, data) => item.update(data);
exports.deleteAccountant = async (item) => item.update({ IsDeleted: true });
