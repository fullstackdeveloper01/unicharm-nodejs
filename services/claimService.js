const db = require('../models');
const { Claim, Employee } = db;

exports.getAllClaims = async () => Claim.findAll({
    where: { IsDeleted: false },
    include: [{ model: Employee, as: 'employee' }]
});
exports.getClaimById = async (id) => Claim.findByPk(id, { include: [{ model: Employee, as: 'employee' }] });
exports.createClaim = async (data) => Claim.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateClaim = async (item, data) => item.update(data);
exports.deleteClaim = async (item) => item.update({ IsDeleted: true });
