const db = require('../../models');
const { Claim, Employee } = db;

exports.getAllClaims = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: { IsDeleted: false },
        include: [{ model: Employee, as: 'employee' }]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Claim.findAndCountAll(queryOptions);
};
exports.getClaimById = async (id) => Claim.findByPk(id, { include: [{ model: Employee, as: 'employee' }] });
exports.createClaim = async (data) => Claim.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateClaim = async (item, data) => item.update(data);
exports.deleteClaim = async (item) => item.update({ IsDeleted: true });
